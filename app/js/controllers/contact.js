'use strict';

/**
 * @ngdoc function
 * @name tempoApp.controller:ContactCtrl
 * @description
 * # ContactCtrl
 * Controller of the tempoApp
 */
angular.module('tempoApp').controller('ContactCtrl', ['$scope', 'Mandrill', 'CONTACT_SUBJECT', 'CONTACT_SENDTO_EMAIL', 'CONTACT_SENDTO_NAME',
  function ($scope, Mandrill, CONTACT_SUBJECT, CONTACT_SENDTO_EMAIL, CONTACT_SENDTO_NAME) {
    $scope.contactStatus = {
      connected: false,
      error: undefined,
      pending: false,
      sent: false
    };

    Mandrill.ping().then(function () {
      $scope.contactStatus.connected = true;
    }, function () {
      $scope.contactStatus.connected = false;
    });

    $scope.name = '';
    $scope.email = '';
    $scope.message = '';

    $scope.onContactFormSubmit = function () {
      var message = {
        'subject': CONTACT_SUBJECT,
        'text': $scope.message,
        'from_email': $scope.email,
        'from_name': $scope.name,
        'to': [
          {
            'email': CONTACT_SENDTO_EMAIL,
            'name': CONTACT_SENDTO_NAME,
            'type':  'to'
          }
        ]
      };

      $scope.contactStatus.pending = true;
      Mandrill.sendMessage(message).then(function () {
        $scope.contactStatus.pending = false;
        $scope.contactStatus.sent = true;
      }, function () {
        $scope.contactStatus.pending = false;
        $scope.contactStatus.error = true;
      });
    };

    $scope.resetForm = function () {
      $scope.contactStatus.sent = false;
      $scope.message = '';
    }
  }
]);
