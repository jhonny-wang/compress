/*
*compress.js
*@version  1.0
*@author 复读机
*
*image compress upload
*/
!(function(){
	function compressUpload(file,callback){
		EXIF.getData(file,function(){
			var fr,orientation;
			orientation = EXIF.getTag(this,"orientation") || "none";
			fr = new FileReader();
			fr.readAsDataURL(file);
			fr.onload = function(){
				var img;
				img = new Image();
				img.onload = function(){
					var compressdSrc = compressImage(img,orientation).src;
					var form = new FormData();
					form.append("image",compressedSrc);
					callback(form);
				};
			};
		});
	};
	function compressImage(source_img_obj, orientation, output_format) {
		var ctx, cvs, h, max_width, mime_type, newImageData, result_image_obj, w;
		mime_type = 'image/jpeg';
		max_width = 720;
		cvs = document.createElement('canvas');
		w = void 0;
		h = void 0;
		ctx = void 0;
		if (output_format !== void 0 && output_format === 'png') {
		  	mime_type = 'image/png';
		}
		cvs.width = max_width;
		if (orientation === 6 || orientation === 8) {
		  	cvs.height = max_width * source_img_obj.naturalWidth / source_img_obj.naturalHeight;
		  	ctx = cvs.getContext('2d');
		  	w = cvs.height;
		  	h = cvs.width;
		  	if (orientation === 6) {
		    	ctx.translate(cvs.width, 0);
		    	ctx.rotate(Math.PI / 2);
		  	} else {
		    	ctx.translate(0, cvs.height);
		    	ctx.rotate(6 * Math.PI / 4);
		  	}
		} else if (orientation === 1 || orientation === 3) {
		  	cvs.height = max_width * source_img_obj.naturalHeight / source_img_obj.naturalWidth;
		  	ctx = cvs.getContext('2d');
		  	w = cvs.width;
		  	h = cvs.height;
		  	if (orientation === 3) {
		    	ctx.translate(cvs.width, cvs.height);
		    	ctx.rotate(Math.PI);
		  	}
		} else {
		  	cvs.height = max_width * source_img_obj.naturalHeight / source_img_obj.naturalWidth;
		  	ctx = cvs.getContext('2d');
		  	w = cvs.width;
		  	h = cvs.height;
		}
		drawImageIOSFix(ctx, source_img_obj, 0, 0, source_img_obj.naturalWidth, source_img_obj.naturalHeight, 0, 0, w, h);
		newImageData = cvs.toDataURL(mime_type);
		result_image_obj = new Image;
		result_image_obj.src = newImageData;
		return result_image_obj;
	};
	/**
	 * Detecting vertical squash in loaded image.
	 * Fixes a bug which squash image vertically while drawing into canvas for some images.
	 * This is a bug in iOS6 devices. This function from https://github.com/stomita/ios-imagefile-megapixel
	 * 
	 */
	function detectVerticalSquash(img) {
	    var iw = img.naturalWidth, ih = img.naturalHeight;
	    var canvas = document.createElement('canvas');
	    canvas.width = 1;
	    canvas.height = ih;
	    var ctx = canvas.getContext('2d');
	    ctx.drawImage(img, 0, 0);
	    var data = ctx.getImageData(0, 0, 1, ih).data;
	    // search image edge pixel position in case it is squashed vertically.
	    var sy = 0;
	    var ey = ih;
	    var py = ih;
	    while (py > sy) {
	        var alpha = data[(py - 1) * 4 + 3];
	        if (alpha === 0) {
	            ey = py;
	        } else {
	            sy = py;
	        }
	        py = (ey + sy) >> 1;
	    }
	    var ratio = (py / ih);
	    return (ratio===0)?1:ratio;
	};

	/**
	 * A replacement for context.drawImage
	 * (args are for source and destination).
	 */
	function drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
	    var vertSquashRatio = detectVerticalSquash(img);
	 // Works only if whole image is displayed:
	 // ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
	 // The following works correct also when only a part of the image is displayed:
	    ctx.drawImage(img, sx * vertSquashRatio, sy * vertSquashRatio, 
	                       sw * vertSquashRatio, sh * vertSquashRatio, 
	                       dx, dy, dw, dh );
	};

	/**
   	 * Export class to global
   	 */
	if(typeof exports === 'object'){   //commonjs
		module.exports = compressUpload;
	}
	else if(typeof define === 'function' && define.amd){  //AMD module
		define(function(){
			return compressUpload;
		});
	}
	else{   //browser global
		global.compressUpload = compressUpload;
	}
})();