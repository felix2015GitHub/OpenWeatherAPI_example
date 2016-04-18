var TabController = function(obj){
    this.srcDom = obj.srcDom;
    this.newDom = obj.newDom;
    this.text = obj.text;
    this.block = obj.block;
    this.func = obj.initFunc;
    this.select = obj.select;
};

TabController.prototype = {
    addTab : function(){
        //console.log(obj);
        $(this.srcDom).append('<div id="'+this.newDom+'" class="tab">'+this.text+'</div>');
        if(this.select == "1"){
            $("#"+this.newDom).addClass("tab_selected");
            $(".content_block > div").hide();
            $("#content_"+this.newDom).show();
            this.func();
        }
        this.addEvents();
    },
    addEvents: function (){
        $("#"+this.newDom).bind('click', {context: this}, this.onClick);
    },
    onClick: function (ev){
        var self = ev.data.context;
        self.handleCellClick();
    },
    handleCellClick: function (){
        $("div"+this.srcDom+" > div").removeClass("tab_selected");
        $(".content_block > div").hide();
        $("#"+this.newDom).addClass("tab_selected");
        $("#content_"+this.newDom).show();
        this.func();
    }
};
