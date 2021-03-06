var Answers = {
  initialize: function($body) {
    if($body.hasClass("edit")) {
      Editor.setup($(".markdown_editor, .wysiwyg_editor"));
    }
  },
  initialize_on_question: function() {
    var answers = $('article.answer').length;
    if(answers == 0){
      $('#new_answer').slideDown('slow');
      $('a#add_answer').addClass('active');
    }
    $(document.body).delegate("form#new_answer .save", "click", function(event) {
      var form = $(this).parents("form");
      var answers = $("#answers-content-wrap .answers-list");
      var button = $(this)

      button.attr('disabled', true)
      if($("form .wysiwyg_editor").length > 0 )
        $("form .wysiwyg_editor").htmlarea('updateTextArea');
      $.ajax({ url: form.attr("action"),
        data: form.serialize()+"&format=js",
        dataType: "json",
        type: "POST",
        success: function(data, textStatus, XMLHttpRequest) {
                    if(data.success) {
                      window.onbeforeunload = null;

                      var answer = $(data.html);
                      answers.children(".empty_answers").remove();
                      answer.find("form.commentForm").hide();
                      answers.append(answer);
                      Effects.fade(answer);
                      Messages.show(data.message, "notice")
                      form.find("textarea").val("");
                      form.find(".markdown_preview").html("");
                      if($(".wysiwyg_editor").length > 0 )
                        $(".wysiwyg_editor").htmlarea('updateHtmlArea');
                      LocalStorage.remove(location.href, "markdown_editor"); // FIXME
                    } else {
                      Messages.show(data.message, "error")
                      if(data.status == "unauthenticate") {
                        window.onbeforeunload = null;
                        Auth.startLoginDialog();
                      }
                    }
                  },
        error: Messages.ajax_error_handler,
        complete: function(XMLHttpRequest, textStatus) {
          button.attr('disabled', false)
        }
      });
      return false;
    });
  },
  create_on_index: function(data) {
  },
  create_on_show: function(data) {
    var is_there = $('.'+data.object_id).length;
    if(is_there==0){
      alert(is_there);
      $(".answers-list").prepend(data.html);
      $("article.answer."+data.object_id).effect("highlight", {}, 3000);
      Ui.hide_comments_form();
    }
  },
  update_on_index: function(data) {

  },
  update_on_show: function(data) {
    $("article.answer."+data.object_id).html(data.html);
    $("article.answer."+data.object_id).effect("highlight", {}, 3000);
  },
  vote: function(data) {
    $("article.answer."+data.object_id+" li.votes_average").text(data.average);
  }
};
