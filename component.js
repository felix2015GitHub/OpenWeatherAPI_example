
var TabController = function (tagTitle, tabContent) {
    this.title = tagTitle;
    this.dom = tabContent;
};

TabController.prototype = {
    title: '',
    dom: '',
    Implement: function () {
        $(".tabbar").append('<div id="'+this.dom+'" class="tab">'+this.title+'</div>');
    }
};