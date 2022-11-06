import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
<% if (appStateInterfacePath) { %> import { AppState } from '<%= appStateInterfacePath %>';<% } %>

import { <%= classify(parentName) %>Store } from '../../../store/<%= dasherize(parentName) %>.store';
import { <%= classify(name) %>State } from '../types/<%= dasherize(name) %>-state/<%= dasherize(name) %>-state.interface';

import { Retrieve } from './<%= dasherize(name) %>.actions';

@Injectable()
export class <%= classify(name) %>Store {

  constructor(
    <% if (parentName) { %> private <%= camelize(parentName) %>Store: <%= classify(parentName) %>Store, <% } %>
    private store: Store<AppState>
  ) {}
  <% if (parentName) { %>

  public get<%= classify(name) %>State(): Observable<<%= classify(name) %>State> {
    return this.<%= camelize(parentName) %>Store.get<%= classify(parentName) %>State().pipe(map(state => state.<%= camelize(name) %>State));
  }
  <% } %>

  public retrieve() {
    this.store.dispatch(new Retrieve());
  }

}
