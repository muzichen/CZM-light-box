var CZM_lightbox = {
    body : document.body,
    lightBox : null,
    lightBoxImg : null,
    defaults : {
        aAnchors : null,
        maskClass : null,
        showImgClass : null,
        hideImgClass : null
    },
    init : function(options){
        var self = this;
        self.defaults.aAnchors = self.getLightImg();
        if(typeof arguments === 'object'){
            self.extendDefaults(self.defaults,options);
        }
        self.clickEvent(self.defaults.aAnchors);
    },
    extendDefaults : function(defaults,options){
        for(var key in options){
           if(options.hasOwnProperty(key)){
                defaults[key] = options[key];
           }
        }
        return defaults;
    },
    getLightImg : function(){
        var aAnchors = document.getElementsByTagName('a'),
            imgArr = [];
        for(var i = 0,len = aAnchors.length;i < len;i++){
            if(aAnchors[i].getAttribute('data-light-box') === 'lightbox' && aAnchors[i].hasChildNodes('img')){
                imgArr.push(aAnchors[i]);
            }
        }
        return imgArr;      
    },
    addEvent : function(ele,type,fn){
        if(window.addEventListener){
            ele.addEventListener(type, function(e){
               fn.call(ele,e);
            });
        }else if(window.attachEvent){
            ele.attachEvent('on' + type,function(e){
                var e = window.event || e;
                fn.call(ele,e);
            });
        }
    },
    clickEvent : function(ele){
        var self = this;
        for(var i = 0,len = ele.length;i < len;i++){
            self.addEvent(ele[i],'click',function(e){
                var children = this.childNodes,
                    oImg = self.getImgChild(children);
                self.imgShowing(oImg);
                
            });
        }
    },
    getImgChild : function(children){
        var arr = [];
        for(var i = 0;i < children.length;i++){
            if(children[i].nodeName === 'IMG'){
                arr.push(children[i]);
            }
        }
        return arr[0];
    },
    imgShowing : function(img){
        var self = this,
            bodyHeight = self.body.scrollHeight,
            wrapDiv = document.createElement('div'),
            imgBox = document.createElement('div'),
            closeDiv = document.createElement('div'),
            newImg = new Image(),
            imgHeight = img.height,
            imgWidth = img.width;
        wrapDiv.id = 'light-box-mask';
        wrapDiv.style.height = bodyHeight + 'px';
        self.defaults.maskClass !== null &&(wrapDiv.className = self.defaults.maskClass);
        imgBox.style.width = imgWidth + 'px';
        imgBox.style.height = imgHeight + 'px';
        imgBox.style.marginLeft = -imgWidth / 2 + 'px';
        imgBox.style.marginTop = -imgHeight / 2 + 'px';
        imgBox.id = 'light-box-img';
        self.defaults.showImgClass !== null && (imgBox.className = self.defaults.showImgClass);
        closeDiv.innerHTML = 'X';
        closeDiv.className = 'img-close';
        newImg.onload = function(){
            imgBox.appendChild(this);
            imgBox.appendChild(closeDiv);
            wrapDiv.appendChild(imgBox);
            self.body.appendChild(wrapDiv);
            self.lightBox = wrapDiv;
            self.lightBoxImg = imgBox;
            self.addEvent(closeDiv,'click',function(){
                self.closeImg.call(self);
            });
        }
        newImg.src = img.src;
    },
    closeImg : function(){
        var self = this;
        self.defaults.hideImgClass !== null && (self.lightBoxImg.className = self.defaults.hideImgClass);
        if(self.detectIE() || self.defaults.hideImgClass === null){
            self.body.removeChild(self.lightBox);
        }else if(self.defaults.hideImgClass !== null){
            self.addEvent(self.lightBoxImg,'animationend',function(){
                self.body.removeChild(self.lightBox);
            });
        }
    },
    detectIE : function(){
         var myNav = navigator.userAgent.toLowerCase();
         return myNav.indexOf('msie') !== -1 ? parseInt(myNav.split('msie')[1]) : false;
    }
};