import { Injectable, Inject, Optional, NgZone } from '@angular/core';
import { FirebaseDatabase } from '@firebase/database-types';
import { PathReference, DatabaseQuery, DatabaseReference, DatabaseSnapshot, ChildEvent, ListenEvent, QueryFn, AngularFireList, AngularFireObject } from './interfaces';
import { getRef } from './utils';
import { InjectionToken } from '@angular/core';
import { FirebaseOptions } from '@firebase/app-types';
import { createListReference } from './list/create-reference';
import { createObjectReference } from './object/create-reference';
import { FirebaseAppConfig, FirebaseAppName, RealtimeDatabaseURL, _firebaseAppFactory } from 'angularfire2';

@Injectable()
export class AngularFireDatabase {
  public readonly database: FirebaseDatabase;

  constructor(
    @Inject(FirebaseAppConfig) config:FirebaseOptions,
    @Optional() @Inject(FirebaseAppName) name:string,
    @Optional() @Inject(RealtimeDatabaseURL) databaseURL:string
  ) {
    const zone = new NgZone({});
    const app = _firebaseAppFactory(config, name);
    this.database = app.database(databaseURL || undefined);
  }

  list<T>(pathOrRef: PathReference, queryFn?: QueryFn): AngularFireList<T> {
    const ref = getRef(this.database, pathOrRef);
    let query: DatabaseQuery = ref;
    if(queryFn) {
      query = queryFn(ref);
    }
    return createListReference<T>(query);
  }

  object<T>(pathOrRef: PathReference): AngularFireObject<T>  {
    const ref = getRef(this.database, pathOrRef);
    return createObjectReference<T>(ref);
  }

  createPushId() {
    return this.database.ref().push().key;
  }

}

export {
  PathReference,
  DatabaseQuery,
  DatabaseReference,
  DatabaseSnapshot,
  ChildEvent,
  ListenEvent,
  QueryFn,
  AngularFireList,
  AngularFireObject,
  AngularFireAction,
  Action,
  SnapshotAction
} from './interfaces';

export { RealtimeDatabaseURL };