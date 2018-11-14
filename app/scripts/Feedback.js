'use strict';

class Feedback {
  constructor(source, container = '#feedback', form = '#feedbackForm') {
    this.source = source;
    this.container = container;
    this.form = form;
    this.feedbackArr = [];
    this.curID = 0;

    this._init(this.source);
    this._renderForm(this.form);
  }

  _init(source) {
    if (!localStorage.getItem('myfeed')) {
      fetch(source)
        .then(result => result.json())
        .then(data => {
          this.curID = data.maxID;
          for (let feedback of data.comments) {
            this.feedbackArr.push(feedback);
            this._renderFeedback(feedback);
          }
          localStorage.setItem('myfeed', JSON.stringify(this.feedbackArr));
          this._initForm()
        });
    } else {
      this.feedbackArr = JSON.parse(localStorage.getItem('myfeed'));
      for (let feedback of this.feedbackArr) {
        this._renderFeedback(feedback);
      }
      this._initForm()
    }
    /*fetch(source)
      .then(result => result.json())
      .then(data => {
        this.curID = data.maxID;
        for (let feedback of data.comments) {
          this.feedbackArr.push(feedback);
          this._renderFeedback(feedback);
        }
        this._initForm()
      });*/
  }

  _renderForm(form) {
    let $addFeedback = $('<button/>', {
      type: 'submit',
      id: 'addFeedback',
      value: 'Add Feedback',
      text: 'Add Feedback'
    });

    let $wrapper = $('<form/>', {
      action: '',
      method: 'post',
      id: 'feedback-form'
    });

    let $nameLabel = $('<label/>', {
      for: 'author'
    });

    let $nameField = $('<input/>', {
      type: 'text',
      name: 'author',
      id: 'author',
      class: 'feedbackForm_author',
      placeholder: 'Name'
    });

    let $msgLabel = $('<label/>', {
      for: 'text'
    });

    let $msgField = $('<textarea/>', {
      name: 'text',
      id: 'text',
      class: 'feedbackForm_msg',
      placeholder: 'Comments'
    });

    let $btnSubmit = $('<button/>', {
      type: 'submit',
      id: 'btnSubmit',
      value: 'Send Feedback',
      text: 'Send Feedback'
    });

    $(form).append($addFeedback);

    $nameLabel.appendTo($wrapper);
    $nameField.appendTo($nameLabel);
    $msgLabel.appendTo($wrapper);
    $msgField.appendTo($msgLabel);
    $btnSubmit.appendTo($wrapper);

    $(form).append($wrapper);

    $('#feedback-form').hide();

    $('#addFeedback').on('click', () => {
      $('#feedback-form').show(100);
      $('#addFeedback').hide(100);
    });

    $('#btnSubmit').on('click', () => {
      $('#feedback-form').hide(100);
      $('#addFeedback').show(100);
    });

  }

  _initForm() {
    $(this.form).submit(e => {
      e.preventDefault();
      if (!$('#author').val() || !$('#text').val()) {
        return;
      }
      let feedback = {
        id: ++this.curID,
        author: $('#author').val(),
        text: $('#text').val(),
        approved: false
      };
      this.feedbackArr.push(feedback);
      this._renderFeedback(feedback);
    })
  }

  _renderFeedback(feedback) {
    let $content = $('<div\>', {
      class: 'feedbackItem',
      'data-feedback': feedback.id
    });

    let $dltBtn = $('<button class="dltBtn"><i class="fas fa-times-circle"></i></button>');
    $content.append($dltBtn);
    $dltBtn.click(() => {
      this._remove(feedback.id)
    });

    $content.append($(`<p class="author">${feedback.author}</p>`));
    $content.append($(`<p class="text">${feedback.text}</p>`));

    if (!feedback.approved) {
      let $approve = $(`<button class="approve-btn"><i class="fas fa-check"></i></button>`);
      $content.append($approve);
      $content.addClass('not-approved');
      $approve.click(() => {
        this._approve(feedback.id);
      })
    } else {
      $content.addClass('approved');
    }
    $(this.container).append($content);
  }

  _approve(id) {
    let find = this.feedbackArr.find(feedback => feedback.id === id);
    $(`div[data-feedback="${id}"]`)
      .addClass('approved')
      .removeClass('not-approved')
      .find('.approve-btn')
      .remove();
    find.approved = true;
    localStorage.setItem('myfeed', JSON.stringify(this.feedbackArr));
  }

  _remove(id) {
    let find = this.feedbackArr.find(feedback => feedback.id === id);
    this.feedbackArr.splice(this.feedbackArr.indexOf(find), 1);
    $(`.feedbackItem[data-feedback="${id}"]`).remove();
    localStorage.setItem('myfeed', JSON.stringify(this.feedbackArr));
  }
}