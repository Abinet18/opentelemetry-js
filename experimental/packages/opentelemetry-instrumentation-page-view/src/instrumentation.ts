/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { InstrumentationBase } from '@opentelemetry/instrumentation';

import { Logger, LogRecord } from '@opentelemetry/api-logs';

import { VERSION } from './version';

/**
 * This class represents a document load plugin
 */

export class PageViewEventInstrumentation extends InstrumentationBase<unknown> {
  readonly component: string = 'page-view-event';
  readonly version: string = '1';
  moduleName = this.component;
  logger: Logger | null = null;

  /**
   *
   * @param config
   */
  constructor(config: any = {}) {
    super('@opentelemetry/instrumentation-page-view', VERSION, config);
    this._setLogger(config);
    this._wrapHistory();
  }

  init() {}

  /**
   * callback to be executed when page is viewed
   */
  private _onPageView() {
    const pageViewEvent: LogRecord = {
      attributes: {
        'event.domain': 'browser',
        'event.name': 'page_view',
        'event.type': 0,
        'event.data': {
          url: document.documentURI as string,
          referrer: document.referrer,
          title: document.title,
        },
      },
    };
    this.logger?.emit(pageViewEvent);
    // console.log('page viewed', pageViewEvent);
  }

  /**
   * callback to be executed when page is viewed
   */
  private _onVirtualPageView(
    changeState: string | null | undefined,
    url: string | null | undefined
  ) {
    const startTime = Date.now() * 1000;
    const oldUrl = window.location.href;
    const currentUrl = url || '';
    const title = document.title;

    const vPageViewEvent: LogRecord = {
      attributes: {
        'event.domain': 'browser',
        'event.name': 'page_view',
        'event.type': 1,
        'event.data': {
          oldUrl: oldUrl,
          url: currentUrl,
          title: title,
          startTime: startTime,
          changeSate: changeState || '',
        },
      },
    };
    this.logger?.emit(vPageViewEvent);
  }

  private _setLogger(config: any) {
    this.logger = config.loggerProvider.getLogger('page_view_event');
  }

  /**
   * executes callback {_onDocumenContentLoaded } when the page is viewed
   */
  private _waitForPageLoad() {
    document.addEventListener('DOMContentLoaded', this._onPageView.bind(this));
  }

  /**
   * implements enable function
   */
  override enable() {
    // remove previously attached load to avoid adding the same event twice
    // in case of multiple enable calling.
    document.removeEventListener('DOMContentLoaded', this._onPageView);
    this._waitForPageLoad();
  }

  /**
   * implements disable function
   */
  override disable() {
    document.removeEventListener('DOMContentLoaded', this._onPageView);
  }

  private _wrapHistory(): void {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (
      data: any,
      title: string,
      url?: string | null | undefined
    ) => {
      originalPushState.apply(history, [data, title, url]);
      this._onVirtualPageView('pushState', url);
    };

    history.replaceState = (
      data: any,
      title: string,
      url?: string | null | undefined
    ) => {
      originalReplaceState.apply(history, [data, title, url]);
      this._onVirtualPageView('replaceState', url);
    };
  }
}
