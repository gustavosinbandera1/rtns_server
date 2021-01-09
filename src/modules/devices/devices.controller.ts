

import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
  } from '@nestjs/common';
  import { DevicesService } from './devices.service';
  import { Devices } from '../../interfaces/devices';
  import { Device } from '../../interfaces/device';
import chalk from 'chalk';
  
  @Controller('devices')
  export class DevicesController {
    constructor(private readonly devicesService: DevicesService) {}
  
    @Get()
    async findAll(): Promise<Devices> {
        console.log(chalk.yellow("aquiiiiiiiiiiiiiiiiii"));
      return this.devicesService.findAll();
    }
  
    @Get(':id')
    async find(@Param('id') id: number): Promise<Device> {
      return this.devicesService.find(id);
    }
  
    @Post()
    async create(@Body('device') device: Device): Promise<void> {
      this.devicesService.create(device);
    }
  
    @Put()
    async update(@Body('device') device: Device): Promise<void> {
      this.devicesService.update(device);
    }
  
    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
      this.devicesService.delete(id);
    }
  }
  
  