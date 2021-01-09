import { Injectable } from '@nestjs/common';
import { Device } from '../../interfaces/device';
import { Devices } from '../../interfaces/devices';

@Injectable()
export class DevicesService {
  private readonly devices: Devices = {
    1: {
      id: 1,
      name: 'Burger',
      price: 5.99,
      description: 'Tasty',
      image: 'https://cdn.auth0.com/blog/whatabyte/burger-sm.png',
    },
    2: {
      id: 2,
      name: 'Pizza',
      price: 2.99,
      description: 'Cheesy',
      image: 'https://cdn.auth0.com/blog/whatabyte/pizza-sm.png',
    },
    3: {
      id: 3,
      name: 'Tea',
      price: 1.99,
      description: 'Informative',
      image: 'https://cdn.auth0.com/blog/whatabyte/tea-sm.png',
    },
  };

  findAll(): Devices {
    return this.devices;
  }

  create(newDevice: Device): void {
    const id = new Date().valueOf();
    this.devices[id] = {
      ...newDevice,
      id,
    };
  }

  find(id: number): Device {
    const record: Device = this.devices[id];

    if (record) {
      return record;
    }

    throw new Error('No record found');
  }

  update(updatedDevice: Device): void {
    if (this.devices[updatedDevice.id]) {
      this.devices[updatedDevice.id] = updatedDevice;
      return;
    }

    throw new Error('No record found to update');
  }

  delete(id: number):void {
    const record: Device = this.devices[id];

    if (record) {
      delete this.devices[id];
      return;
    }

    throw new Error('No record found to delete');
  }
}