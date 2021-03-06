import { Controller, Get, HttpException, HttpStatus, Logger, Query, Res, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery } from '@nestjs/swagger';
import { BarcodeService } from './barcode.service';
const fs = require('fs');

@Controller('barcode')
export class BarcodeController {
  constructor(
    private barcodeService: BarcodeService
  ) { }

  @ApiQuery({ name: 'text' })
  @Get()
  async genBarcode(@Res() res, @Query() query) {
    try {
      const responseData = await this.barcodeService.genBarcode(query);
      if (!fs.existsSync(`./files/barcode/${query.text}.png`)) {
        await fs.writeFileSync(`./files/barcode/${query.text}.png`, responseData, 'base64');
      }
      return await res.status(HttpStatus.OK).sendFile(`${query.text}.png`, { root: "./files/barcode/" });
    } catch (error) {
      throw new HttpException(`[generate barcode] => ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }
}
