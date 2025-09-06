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

  async findMetadataById(id: string) {
    const file = await this.fileModel.findById(id);
    return file;
  }

  async remove(paths: string[]) {
    await this.fileModel.deleteMany({ path: { $in: paths } });
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
