import fs from 'fs/promises';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { File } from './schemas/file.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FilesService {
  constructor(@InjectModel(File.name) private fileModel: Model<File>) {}
  async upload(uploadFiles: File[]) {
    const newFiles = await this.fileModel.create(uploadFiles);
    return newFiles;
  }

  async findById(id: string) {
    const file = await this.fileModel.findById(id);
    return file;
  }

  async remove(ids: string[]) {
    const toBeDeleted = await this.fileModel.find({ _id: { $in: ids } });
    const paths = toBeDeleted.map((d) => d.path);
    await this.fileModel.deleteMany({ _id: { $in: ids } });
    let removedFilesCount = 0;
    for (const path of paths) {
      try {
        await fs.rm(path);
        removedFilesCount++;
      } catch {}
    }
    return { count: removedFilesCount };
  }
}
