import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as v8 from 'v8';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors({
  //   origin: 'http://localhost:3500',
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //   allowedHeaders: 'Content-Type, Authorization', 
  //   credentials: true, 
  // });
  // const v8 = require('v8');
  // console.log(`V8 Max Heap Size: ${v8.getHeapStatistics().heap_size_limit / 1024 / 1024} MB`);

    // Log memory usage every 10 seconds
    // setInterval(() => {
    //   const memoryUsage = process.memoryUsage();
    //   console.log({
    //     rss: `${Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100} MB`, // Resident Set Size
    //     heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100} MB`, // Total heap size
    //     heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100} MB`, // Heap used
    //     external: `${Math.round(memoryUsage.external / 1024 / 1024 * 100) / 100} MB`, // External memory
    //     arrayBuffers: `${Math.round(memoryUsage.arrayBuffers / 1024 / 1024 * 100) / 100} MB` // ArrayBuffers
    //   });
    // }, 10000); 

    
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
