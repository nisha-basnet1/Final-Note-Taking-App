import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imagePreview',
  standalone: true
})
export class ImagePreviewPipe implements PipeTransform {

  transform(file:File): unknown {
    return URL.createObjectURL(file);
  }

}
