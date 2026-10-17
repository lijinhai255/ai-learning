import { Module } from "@nestjs/common";
import { DsService } from "./ds.service.js";

@Module({
  providers: [DsService],
  exports: [DsService]
})
export class DsModule {}