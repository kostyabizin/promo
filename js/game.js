$(function() {
    var gameTexts = {};

    var numQuestion = 0;
    var currentNumQuestion = 1;
    var allNumQuestion;
    var currentNumQuestionSpan = $('.js-current-num-question');
    var allNumQuestionSpan = $('.js-all-num-question');
    var nextQuestionBtn = $('.js-next-question');

    var startQuestionBlock = $('.js-question-block-start');
    var correctQuestionBlock = $('.js-question-block-correct');
    var wrongQuestionBlock = $('.js-question-block-wrong');
    
    var answerItem = $('.js-answer-item');
    var startAnswerBlock = $('.js-answer-list-start');
    var correctAnswerBlock = $('.js-answer-list-correct');
    var correctAnswerItem = correctAnswerBlock.find('.answer__item'); 
    

    function addTextToAnswerBtn(data, idxElem, idxAnswer, element) {
        $(element).find('h3').text(data.answers[idxAnswer][idxElem].title)
        $(element).find('p').text(data.answers[idxAnswer][idxElem].text)
        $(element).addClass(data.answers[idxAnswer][idxElem].isCorrect)
        currentNumQuestionSpan.text(currentNumQuestion)
    }

    $.ajax({
        url: `${location.origin}/js/game-information.json`,
        dataType: "json",
        success: function(data) {
            allNumQuestion = Object.keys(data.questions).length
            allNumQuestionSpan.text(allNumQuestion)
            startQuestionBlock.find('.question__text').text(data.questions[numQuestion])
            answerItem.each((idx, elem) => {
                addTextToAnswerBtn(data, idx, numQuestion, elem)
            })
        },
        error: function(er) {
            console.log(er);
        },
        complete: function(data) {
            gameTexts = data.responseJSON
        }
    });

    $('body').on('click', '.js-answer-item', function(event) {
        event.preventDefault();
        var _answer = $(this);
        var _isCorrect = _answer.hasClass('correct')
        answerItem.removeClass('choiced')
        startQuestionBlock.fadeOut(100, function() {
            if (!_isCorrect) {
                wrongQuestionBlock.fadeIn().css({'display':'flex'})
                _answer.addClass('choiced')
            } else {
                numQuestion++
                currentNumQuestion++
                wrongQuestionBlock.fadeOut(0)
                _answer.removeClass('correct')
                correctAnswerItem.html(_answer.html())

                startAnswerBlock.fadeOut(100, function() {
                    if (currentNumQuestion > allNumQuestion) {
                        nextQuestionBtn.html('Показать результат').attr('href', '/results_1.html')
                    } else {
                        currentNumQuestionSpan.html(currentNumQuestion)
                        startQuestionBlock.find('.question__text').text(gameTexts.questions[numQuestion])
                        answerItem.each((idx, elem) => {
                            addTextToAnswerBtn(gameTexts, idx, numQuestion, elem)
                        })
                    }
                    correctAnswerBlock.fadeIn(100)
                    correctQuestionBlock.fadeIn(100).css({'display':'flex'})
                })
            }
        })
    })

    $('body').on('click', '.js-btn-quetsion-repeat', function(event) {
        wrongQuestionBlock.fadeOut(100, function() {
            startQuestionBlock.fadeIn()
        })
    })

    $('body').on('click', '.js-next-question', function(event) {
        correctQuestionBlock.fadeOut(100)
        correctAnswerBlock.fadeOut(100, function() {
            startQuestionBlock.fadeIn()
            startAnswerBlock.fadeIn()
        })
    })
    

})