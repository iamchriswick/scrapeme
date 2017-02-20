import $ from 'jquery';
import swal from 'sweetalert2';
import * as firebase from 'firebase/app';
import 'firebase/database';

import queryString from 'query-string';
import CryptoJS from 'crypto-js';
import firebaseConfig from './firebaseConfig';

(function(window, document, $, undefined) {

  'use strict';

  window.SCRAPE = {};

  SCRAPE.init = function() {

    // developers can access this
    SCRAPE.genericCacheSelectors();
    SCRAPE.initFirebase();
    SCRAPE.extensionInit();
    // debugger;
  }

  SCRAPE.genericCacheSelectors = function() {

    // cache our selectors here, can use them throughout the file
    SCRAPE.body = $('body');
    // SCRAPE.classes = 'class1 class2';

  }

  SCRAPE.initFirebase = function() {

    const config = new firebaseConfig();

    firebase.initializeApp({
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      databaseURL: config.databaseURL,
    });

    // Get a reference to the database service
    const firebaseRef = firebase.app().database().ref();

    firebaseRef.once('value')
      .then(function(snap) {
        console.log('snap.val()', snap.val());
      });
  }

  SCRAPE.extensionInit = function() {

    if (location.hostname.match('utdanning.no')) {

      chrome.extension.sendMessage('showPageAction');

      console.log('Utdanning.no');

      $(window).on('hashchange', function(e) {

        var hash = location.hash.replace(/^#\/yrker\/\?/, '');

        if (hash !== '#/yrker/') {

          var parsedHash = queryString.parse(unescape(hash));

          if ($.isArray(parsedHash.interesse) === false) {

            // console.log(parsedHash);
            // console.log(parsedHash.interesse);

            var selectedIndustry = parsedHash.interesse;
            // console.log(selectedIndustry);

            // Create Industries array
            var industriesElms = $('#interessefilter form ul li');
            var industriesArr = $.makeArray(industriesElms);
            // console.log(industriesArr);

            for (var i = 0, l = industriesArr.length; i < l; i++) {

              // const industryId = i;

              var industryName = industriesArr[i].childNodes[3].innerText;
              const industryName = industryName.toLowerCase();

              const industryHash = CryptoJS.SHA256(industryName);
              const industryId = industryHash.toString(CryptoJS.enc.Hex);

              // Create Occupation array
              var occupationsElms = $('#articlelist-start ul li');
              var occupationsArr = $.makeArray(occupationsElms);
              // console.log(occupationsArr);

              if (industryName === selectedIndustry) {

                console.log(industryId);

                console.log(i, industryName);

                var delayedPush = function(industry) {
                  return new Promise(function(resolve, reject) {
                    setTimeout(function() {
                      industriesRef.child(industryId).update(industry)
                        .then(resolve, reject);
                    }, 1);
                  });
                };

                delayedPush({
                    id: industryId,
                    name: industryName
                  })
                  .then(function() {

                    console.info('Industry was saved to Firebase');

                    for (var i = 0, l = occupationsArr.length; i < l; i++) {

                      // const occupationId = i;

                      var occupationName = occupationsArr[i].childNodes["0"].firstChild.textContent;
                      const occupationName = $.trim(occupationName);
                      // console.log(occupationName);

                      const occupationHash = CryptoJS.SHA256(occupationName);
                      const occupationId = occupationHash.toString(CryptoJS.enc.Hex);

                      var delayedPush = function(occupation) {
                        return new Promise(function(resolve, reject) {
                          setTimeout(function() {
                            occupationsRef.child(occupationId).update(occupation)
                              .then(resolve, reject);
                          }, 1);
                        });
                      };

                      delayedPush({
                          id: occupationId,
                          name: occupationName
                        })
                        .then(function() {

                          console.info('Occupation was saved to Firebase');

                          var id = industryId;
                          var industryObj = {};
                          industryObj[id] = true;

                          var currentOcupationRef = occupationsRef.child(occupationId);
                          currentOcupationRef.child('industries').update(industryObj);


                        })
                        .catch(function(err) {
                          console.log('error', err);
                        });

                    }

                  })
                  .catch(function(err) {
                    console.log('error', err);
                  });

              }

            }

          }

        }

      });

    }

  }

  SCRAPE.init();

})(window, document, $);
