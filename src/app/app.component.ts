import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgxGalleryImage, NgxGalleryOptions} from 'ngx-gallery';
import {QartForm, QartResponse} from './qart-form';
import {DomSanitizer} from '@angular/platform-browser';
import {QartService} from './qart.service';
import {environment} from '../environments/environment';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'qart-web';
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  loading = false;

  @ViewChild('imgInput') imgInput: ElementRef;
  @ViewChild('imgElem') imgElem: ElementRef<HTMLImageElement>;

  previewImg = 'assets/placeholder.png';
  qartForm = new QartForm('', 0, 0, 0, null, false);

  constructor(private sanitizer: DomSanitizer, private qartService: QartService) {
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  submit() {
    this.loading = true;
    this.qartService.buidQart(this.qartForm).subscribe((resp: QartResponse) => {
      this.loading = false;
      if (resp.error) {
        alert(resp.error);
        return;
      }
      const imgURL = environment.backendHost + resp.imageURL;
      this.galleryImages.unshift({
        small: imgURL,
        medium: imgURL,
        big: imgURL
      });
    });
  }

  toggleEmbedMode() {
    this.qartForm.embed = !this.qartForm.embed;
  }

  get isChecked(): boolean {
    return this.qartForm.embed;
  }

  updateSelectAreaValue(xpos: number, ypos: number, x2pos: number, y2xpos: number) {
    this.qartForm.width = Math.floor((x2pos - xpos) * (this.imgElem.nativeElement.naturalWidth / this.imgElem.nativeElement.width));
    this.qartForm.xpos = Math.floor((xpos / this.imgElem.nativeElement.width) * this.imgElem.nativeElement.naturalWidth);
    this.qartForm.ypos = Math.floor((ypos / this.imgElem.nativeElement.height) * this.imgElem.nativeElement.naturalHeight);
  }

  ngAfterViewInit() {
    $('img').imgAreaSelect({
        aspectRatio: '1:1',
        handles: true,
        onSelectEnd: (img, selection) => {
          this.updateSelectAreaValue(selection.x1, selection.y1, selection.x2, selection.y2);
        }
      }
    );
    const input = this.imgInput.nativeElement;
    input.onchange = () => {
      const files = input.files;
      if (!(files && files.length > 0)) {
        return;
      }
      const file = files[0];
      // only manage image file
      if (!/^(image\/*)/.test(file.type)) {
        return;
      }
      this.qartForm.img = file;
      this.previewImg = URL.createObjectURL(file);
    };
  }

  ngOnInit() {
    this.galleryOptions = [
      {'image': false, height: '150px'},
      {'breakpoint': 500, 'width': '100%'}
    ];

    this.galleryImages = [
      {
        small: 'assets/example1.png',
        medium: 'assets/example1.png',
        big: 'assets/example1.png'
      },
      {
        small: 'assets/example2.png',
        medium: 'assets/example2.png',
        big: 'assets/example2.png'
      },
      {
        small: 'assets/example3.gif',
        medium: 'assets/example3.gif',
        big: 'assets/example3.gif'
      },
      {
        small: 'assets/example4.gif',
        medium: 'assets/example4.gif',
        big: 'assets/example4.gif'
      }
    ];
  }
}
