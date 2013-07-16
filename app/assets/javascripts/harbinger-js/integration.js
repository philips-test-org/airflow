(function($) {
    if ($.harbingerjs == undefined) { $.harbingerjs = {}; }
    if ($.harbingerjs.integration == undefined) { $.harbingerjs.integration = {}; }
    var ig = $.harbingerjs.integration;

    ig.imageViewer = {};

    ig.imageViewer.url = {
	iframeContainer: function() { if ($('#image-viewer-url-frame').size() == 0) { $('body').append('<div id="image-viewer-url-frame" style="display: none;"></div>'); } },
	viewFuns: {
	    iframe: function(url) { ig.imageViewer.url.iframeContainer().html('<iframe src="' + url + '"></iframe>'); },
	    window: function(url) { window.open(url); }
	},

	create: function(definition) {
	    var integration = {
		definition: definition,
		view: function(exam,displayFun) {
		    if (displayFun == undefined) { displayFun = "iframe" }
		    var url = this.url(exam);
		    if ($.type(displayFun) == "function") { displayFun(url); }
		    else { ig.imageViewer.url.viewFuns[displayFun](url) }
		    return url;
		},

		url: function(exam) {
		    var url = this.definition.url + "?";
		    $.each(definition.parameters,function(iparam,exam_attribute) { url += iparam + "=" + exam[exam_attribute] + "&"; });
		    return url.replace(/&$/,"");
		}
	    }
	    return integration;
	}
    };

    ig.setup = function(definition) {
	if ($.type(definition) == "string") { definition = $.parseJSON(definition); }
	if (definition.type == "imageViewer") {
	    if (definition.iclass == "thick") { throw("Thick definitions are currently unsupported. Please use asic directly"); }
	    else if (definition.iclass == "url") { return ig.imageViewer.url.create(definition); }
	}
    };

    ig.view = function(definition,exam,displayFun) {
	var integration = ig.setup(definition);
	integration.view(exam,displayFun);
    };

})(jQuery)