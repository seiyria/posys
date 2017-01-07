/* tslint:disable:only-arrow-functions no-invalid-this */

import * as _ from 'lodash';

import { readSettings } from './_settings';

import { bookshelf, knex } from '../server';

import { Invoice } from '../orm/invoice';
import { InvoiceItem } from '../orm/invoiceitem';
import { InvoicePromo } from '../orm/invoicepromo';

import { Invoice as InvoiceModel } from '../../client/models/invoice';
import { StockItem as StockItemModel } from '../../client/models/stockitem';
import { Promotion as PromotionModel } from '../../client/models/promotion';
import { InvoiceItem as InvoiceItemModel } from '../../client/models/invoiceitem';
import { InvoicePromo as InvoicePromoModel } from '../../client/models/invoicepromo';

import { Logger } from '../logger';
import Settings from './_settings';

import { recordAuditMessage, recordErrorMessageFromServer, MESSAGE_CATEGORIES } from './_logging';

const dateFunctions = require('date-fns');
const thermalPrinter = require('node-thermal-printer');

let nodePrinter = null;
try {
  nodePrinter = require('printer');
} catch(e) {
  console.error('Could not load node-printer.');
}

const incrementItems = (items, transaction?) => {
  return _.map(items, (v: number, k: string) => {
    let base = knex('stockitem');
    if(transaction) { base = base.transacting(transaction); }
    return base
      .where('sku', '=', k)
      .increment('quantity', v);
  });
};

const decrementItems = (items, transaction?, updateLastSoldAt?) => {
  return _.map(items, (v: number, k: string) => {
    let base = knex('stockitem');
    if(transaction) { base = base.transacting(transaction); }

    const updateOptions: any = {
      quantity: knex.raw(`quantity - ${v}`)
    };

    if(updateLastSoldAt) {
      updateOptions.lastSoldAt = new Date();
    }

    const query = base
      .where('sku', '=', k)
      .update(updateOptions);

    return query;
  });
};

const itemsFromInvoiceToStockable = (items) => {
  return _.reduce(items, (prev, cur: StockItemModel) => {
    prev[cur.sku] = prev[cur.sku] || 0;
    prev[cur.sku] += cur.quantity;
    return prev;
  }, {});
};

export default (app) => {

  app.put('/invoice', (req, res) => {

    const invoice = req.body;
    const items = invoice.stockitems;
    const promos = invoice.promotions;

    const locationId = req.header('X-Location');
    const terminalId = req.header('X-Terminal');

    if(!locationId) {
      return res.json({ flash: 'Location is not specified in system settings. Transaction aborted.' });
    }

    if(!terminalId) {
      return res.json({ flash: 'Terminal id is not specified in system settings. Transaction aborted.' });
    }

    delete invoice.stockitems;
    delete invoice.promotions;

    invoice.locationId = +locationId;
    invoice.terminalId = terminalId;

    const errorHandler = (e) => {
      if(res.headersSent) { return; }
      recordErrorMessageFromServer(req, MESSAGE_CATEGORIES.INVOICE, e);
      res.status(500).json({ formErrors: e.data || [], flash: 'Transaction failed to complete correctly.' });
    };

    bookshelf.transaction(t => {

      const countMap = itemsFromInvoiceToStockable(items);

      const itemPromises = (newInvoice) => _.map(items, (i: any) => {
        i.invoiceId = newInvoice.id;
        i.stockitemId = i.id;
        delete i.id;

        if(i.temporary) {
          i.stockitemData = new StockItemModel(i);
        }

        return InvoiceItem.forge().save(new InvoiceItemModel(i), { transacting: t }).catch(errorHandler);
      });

      const promoPromises = (newInvoice) => _.map(promos, (i: any) => {

        i.invoiceId = newInvoice.id;
        delete i.id;

        if(i.temporary) {
          i.promoData = new PromotionModel(i);
        }

        const model = new InvoicePromoModel(i);
        delete model.skus;

        return InvoicePromo.forge().save(model, { transacting: t }).catch(errorHandler);
      });

      let otherPromises = [];

      if(!invoice.isOnHold && !invoice.isVoided) {
        if(invoice.isReturned) {
          otherPromises = incrementItems(countMap, t);
        } else {
          otherPromises = decrementItems(countMap, t, true);
        }
      }

      if(invoice.previousId) {
        otherPromises.push(Invoice.forge({ id: invoice.previousId }).destroy({ transacting: t }));
        delete invoice.previousId;
      }

      Invoice
        .forge()
        .save(invoice, { transacting: t })
        .then(item => {
          return Promise
            .all(itemPromises(item).concat(promoPromises(item)).concat(otherPromises))
            .then(t.commit, t.rollback)
            .then(() => {
              recordAuditMessage(req,
                MESSAGE_CATEGORIES.INVOICE,
                `A new ${invoice.purchaseMethod} invoice was created for ${(+invoice.purchasePrice).toFixed(2)}.`,
                { id: item.id });
              res.json({ flash: `Transaction completed successfully.`, data: item });
            })
            .catch(errorHandler);
        })
        .catch(errorHandler);
    });
  });

  app.get('/invoice', (req, res) => {

    const pageOpts = {
      pageSize: +req.query.pageSize || Settings.pagination.pageSize,
      page: +req.query.page || 1,
      withRelated: ['stockitems', 'promotions', 'stockitems._stockitemData', 'promotions._promoData']
    };

    const earliestDate  = req.query.earliestDate;
    const latestDate    = req.query.latestDate;
    const hideVoided    = +req.query.hideVoided;
    const hideReturns   = +req.query.hideReturns;
    const hideHolds     = +req.query.hideHolds;
    const hideCompleted = +req.query.hideCompleted;

    Invoice
      .forge()
      .query(qb => {
        if(earliestDate) {
          qb.andWhere('purchaseTime', '>=', earliestDate);
        }

        if(latestDate) {
          qb.andWhere('purchaseTime', '<=', latestDate);
        }

        if(hideVoided) {
          qb.andWhere('isVoided', '!=', true);
        }

        if(hideReturns) {
          qb.andWhere('purchaseMethod', '!=', 'Return');
        }

        if(hideHolds) {
          qb.andWhere('isOnHold', '!=', true);
        }

        if(hideCompleted) {
          qb
            .whereNot(function() {
              this
                .where('isVoided', '!=', true)
                .andWhere('isOnHold', '!=', true)
                .andWhere('purchaseMethod', '!=', 'Return');
            });
        }
      })
      .orderBy('-id')
      .fetchPage(pageOpts)
      .then(collection => {
        res.json({ items: collection.toJSON(), pagination: collection.pagination });
      })
      .catch(e => {
        recordErrorMessageFromServer(req, MESSAGE_CATEGORIES.INVOICE, e);
        res.status(500).json(Logger.browserError(Logger.error('Route:Invoice:GET', e)));
      });
  });

  app.post('/invoice/void/:id', (req, res) => {

     Invoice
      .forge({ id: req.params.id })
      .fetch({
        withRelated: ['stockitems', 'promotions', 'stockitems._stockitemData', 'promotions._promoData']
      })
      .then(item => {
        const unwrappedItem = item.toJSON();
        unwrappedItem.isVoided = !unwrappedItem.isVoided;

        const items = _.map(unwrappedItem.stockitems, (innerItem: any) => {
          const itemData = innerItem.stockitemData || innerItem._stockitemData;
          itemData.quantity = innerItem.quantity;
          return itemData;
        });

        const inventoryHash = itemsFromInvoiceToStockable(items);
        let inventoryPromises = [];

        let type = '';

        if(unwrappedItem.isVoided) {
          type = 'unvoided';
          inventoryPromises = incrementItems(inventoryHash);
        } else {
          type = 'voided';
          inventoryPromises = decrementItems(inventoryHash);
        }

        delete unwrappedItem.stockitems;
        delete unwrappedItem.promotions;

        const savePromise = Invoice
          .forge({ id: req.params.id })
          .save(unwrappedItem, { patch: true })
          .catch(e => {
            recordErrorMessageFromServer(req, MESSAGE_CATEGORIES.INVOICE, e);
            res.status(500).json(Logger.browserError(Logger.error('Route:Invoice/:id/void:POST', e)));
          });

        Promise.all([savePromise].concat(inventoryPromises))
          .then(resolvedPromises => {
            // [0] is the saved item
            recordAuditMessage(req, MESSAGE_CATEGORIES.INVOICE, `An invoice was ${type}.`, { id: +req.params.id });
            res.json(resolvedPromises[0]);
          });
      })
      .catch(e => {
        recordErrorMessageFromServer(req, MESSAGE_CATEGORIES.INVOICE, e);
        res.status(500).json(Logger.browserError(Logger.error('Route:Invoice/:id/void:POST', e)));
      });
  });

  app.post('/invoice/print/:id', (req, res) => {

    const printCustomer = !!+req.query.printCustomer;

    if(!nodePrinter) {
      return res.status(500).json({ flash: 'Printer driver is not installed on the server.' });
    }

    readSettings(data => {

      let { name, type, header, footer, characterWidth, printMerchantReceipts, printReceiptBarcodes } = data.printer;
      if(!characterWidth) {
        characterWidth = 48;
      }
      const { businessName } = data.application;

      if(!printCustomer && !printMerchantReceipts) {
        return;
      }

      if(!name) {
        return res.status(500).json({ flash: 'No printer is set up.' });
      }

      const cleanName = (printName, length = 22) => {
        return _.truncate(printName, { length, omission: '' });
      };

      const invoiceItemData = (item) => {
        if(!_.isEmpty(item.stockitemData)) { return item.stockitemData; }
        return item._stockitemData;
      };

      const invoicePromoData = (item) => {
        if(!_.isEmpty(item.promoData)) { return item.promoData; }
        return item._promoData;
      };

      const printInvoice = (invoice: InvoiceModel, copy = 'Merchant') => {

        thermalPrinter.clear();
        thermalPrinter.init({ width: characterWidth, type });

        thermalPrinter.openCashDrawer();

        if(businessName) {
          thermalPrinter.alignCenter();
          thermalPrinter.setTextDoubleHeight();
          thermalPrinter.println(businessName);
          thermalPrinter.setTextNormal();
          thermalPrinter.alignLeft();
        }

        if(header) {
          thermalPrinter.alignCenter();
          thermalPrinter.println(header);
          thermalPrinter.newLine();
          thermalPrinter.alignLeft();
        }

        thermalPrinter.leftRight('Method', invoice.purchaseMethod);
        thermalPrinter.leftRight('Time', dateFunctions.format(new Date(invoice.purchaseTime), 'YYYY-MM-DD hh:mm A'));
        thermalPrinter.leftRight('Location', invoice.location.name);
        thermalPrinter.leftRight('Terminal', invoice.terminalId);
        thermalPrinter.leftRight('# Items', _.sumBy(invoice.stockitems, 'quantity'));
        thermalPrinter.newLine();

        _.each(invoice.stockitems, item => {
          thermalPrinter.alignLeft();

          // space for up to 100$ worth in transaction before the stuff starts to overlap
          const rightSideSpace = 8;
          const skuHalf = `-${item.realData.sku}`;
          const nameLength = characterWidth - skuHalf.length - rightSideSpace;
          const name = cleanName(item.realData.name, nameLength);
          thermalPrinter.println(`${name}${skuHalf}`);
          thermalPrinter.leftRight(`${item.quantity} x ${item.cost}`, (+(item.cost * item.quantity)).toFixed(2));

          _.each(invoice.promotions, promo => {
            if(item.promoApplyId !== promo.applyId) {
              return;
            }

            thermalPrinter.leftRight(cleanName(promo.realData.name, characterWidth - rightSideSpace), promo.cost);
          });
        });

        thermalPrinter.newLine();

        thermalPrinter.leftRight('Subtotal', invoice.subtotal);
        thermalPrinter.leftRight('Tax', invoice.taxCollected);

        thermalPrinter.setTextDoubleHeight();
        thermalPrinter.leftRight('Grand Total', invoice.purchasePrice);
        thermalPrinter.setTextNormal();

        thermalPrinter.newLine();

        thermalPrinter.newLine();

        if(footer) {
          thermalPrinter.alignCenter();
          thermalPrinter.println(footer);
        }

        thermalPrinter.newLine();
        thermalPrinter.alignCenter();
        thermalPrinter.println(`${copy} Copy`);
        thermalPrinter.newLine();

        thermalPrinter.alignCenter();
        if(printReceiptBarcodes) {
          if(type === 'epson') {
            thermalPrinter.printBarcode(invoice.id, { });
          } else if(type === 'star') {
            thermalPrinter.code128(invoice.id, { width: 'MEDIUM', text: 1 });
          }
        }
        thermalPrinter.newLine();
        thermalPrinter.println(`Invoice #${invoice.id}`);
        thermalPrinter.alignLeft();

        thermalPrinter.cut();
      };

      Invoice
        .forge({ id: req.params.id })
        .fetch({
          withRelated: ['stockitems', 'promotions', 'stockitems._stockitemData', 'promotions._promoData', 'location']
        })
        .then(item => {
          const unwrappedItem = item.toJSON();
          _.each(unwrappedItem.stockitems, innerItem => innerItem.realData = invoiceItemData(innerItem));
          _.each(unwrappedItem.promotions, innerItem => innerItem.realData = invoicePromoData(innerItem));

          printInvoice(unwrappedItem, 'Guest');

          if(printMerchantReceipts) {
            printInvoice(unwrappedItem, 'Merchant');
          }

          nodePrinter.printDirect({
            printer: name,
            data: thermalPrinter.getBuffer(),
            type: 'RAW',
            success: () => res.json({ flash: 'Print successful.' }),
            error: (e) => {
              recordErrorMessageFromServer(req, MESSAGE_CATEGORIES.INVOICE, e);
              res.json({ flash: `Print failure: ${e.message}`});
            }
          });

        })
        .catch(e => {
          recordErrorMessageFromServer(req, MESSAGE_CATEGORIES.INVOICE, e);
          res.status(500).json(Logger.browserError(Logger.error('Route:Invoice/:id/print:POST', e)));
        });
    });
  });

};
