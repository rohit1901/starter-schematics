import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { classify } from "@angular-devkit/core/src/utils/strings";

@Injectable()
export class <%= classify(name) %>Service {

  constructor(private httpClient: HttpClient) {}

}
