import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
const JsBarcode = require('jsbarcode');
const { createCanvas } = require("canvas");
const base64ToImage = require('base64-to-image');

@Injectable()
export class BarcodeService {
  async genBarcode(query: any = null) {
    try {
      if (query) {
        const {
          format, text, marginBottom, width, height, fontOptions, font, textAlign, textPosition,
          textMargin, fontSize, background, lineColor, margin, marginLeft, marginTop
        } = query;

        if (typeof text !== "undefined") {
          let options = {};
          const canvasDOM = await createCanvas();

          if (typeof format !== "undefined") {
            options['format'] = format;
            if (format === "EAN8" || format === "EAN13") {
              options['flat'] = true;
            }
          } else {
            options['format'] = "CODE128";
          }

          if (typeof text !== "undefined") {
            options['text'] = text.split('\n').join(' ');
          }

          if (typeof width !== "undefined") {
            options['width'] = width;
          }

          if (typeof height !== "undefined") {
            options['height'] = height;
          }

          if (typeof background !== "undefined") {
            options['background'] = `#${background}`;
          } else {
            options['background'] = `#ffffff`;
          }

          if (typeof lineColor !== "undefined") {
            options['lineColor'] = `#${lineColor}`;
          }

          if (typeof textAlign !== "undefined") {
            options['textAlign'] = textAlign;
          }

          if (typeof textPosition !== "undefined") {
            options['textPosition'] = textPosition;
          }

          if (typeof margin !== "undefined") {
            options['margin'] = margin;
          }

          if (typeof marginLeft !== "undefined") {
            options['marginLeft'] = marginLeft;
          }

          if (typeof marginBottom !== "undefined") {
            options['marginBottom'] = marginBottom;
          }

          if (typeof marginTop !== "undefined") {
            options['marginTop'] = marginTop;
          }

          if (typeof textMargin !== "undefined") {
            options['textMargin'] = textMargin;
          }

          if (typeof fontOptions !== "undefined") {
            options['fontOptions'] = fontOptions;
          }

          if (typeof font !== "undefined") {
            options['font'] = font;
          }

          if (typeof fontSize !== "undefined") {
            options['fontSize'] = fontSize;
          }

          await JsBarcode(canvasDOM, text, options);

          return await `${canvasDOM.toDataURL('image/png')}`.replace(/^data:image\/png;base64,/, "");
        } else {
          throw new HttpException("Undefined param require.", HttpStatus.BAD_REQUEST);
        }
      }
    } catch (error) {
      throw new HttpException(`[JsBarcode fail.] => ${error.message}`, HttpStatus.BAD_REQUEST);
    }

  }
}
