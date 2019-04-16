(function (lib, img, cjs) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 45,
	height: 45,
	fps: 24,
	manifest: []
};

// symbols:



(lib.corazon = function() {
	this.initialize();

	// Capa 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#E52420").s().p("AACBpQgpAAgvgpQg2guAHg0IAAgBQAAgdAXgVQAXgTAfAAQASAAAQAIQARAJAIAOQAWgfAkAAQAfAAAVATQAWAUAAAeIAAABQAAA1gwAtQgrApgpAAg");
	this.shape.setTransform(13.6,10.6);

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,27.1,21.2);


// stage content:
(lib.gif = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// guardando formulario
	this.instance = new lib.corazon();
	this.instance.setTransform(22.1,22.5,1,1,0,0,0,13.6,10.6);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({scaleX:0.5,scaleY:0.5,x:22},9,cjs.Ease.get(0.33)).to({scaleX:1,scaleY:1,x:22.1},5,cjs.Ease.get(-0.24)).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(31,34.4,27.1,21.2);

})(lib = lib||{}, images = images||{}, createjs = createjs||{});
var lib, images, createjs;