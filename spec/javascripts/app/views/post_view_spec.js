describe("App.views.Post", function(){

  describe("#render", function(){
    beforeEach(function(){
      // should be jasmine helper
      window.current_user = App.user({name: "alice", avatar : {small : "http://avatar.com/photo.jpg"}});

      var posts = $.parseJSON(spec.readFixture("multi_stream_json"))["posts"][0];
      spec.loadFixture("underscore_templates");

      this.collection = new App.Collections.Stream(posts);
      this.statusMessage = this.collection.models[0];
    })

    context("NSFW", function(){
      it("contains a shield element", function(){
        this.statusMessage.set({text : "this is safe for work. #sfw"});

        var view = new App.Views.Post({model : this.statusMessage}).render();
        var statusElement = $(view.el)

        expect(statusElement.find(".shield").html()).toBeNull();
      })

      it("does not contain a shield element", function(){
        this.statusMessage.set({text : "nudie magazine day! #nsfw"});

        var view = new App.Views.Post({model : this.statusMessage}).render();
        var statusElement = $(view.el)

        expect(statusElement.find(".shield").html()).toNotBe(null);
      })
    })

    context("Reshare link", function(){
      it("is present if the post is public", function(){
        var view = new App.Views.Post({model : this.statusMessage}).render();
        this.statusMessage.set({"public" : true});

        var statusElement = $(view.el)

        expect(statusElement.find(".reshare_action")).toNotBe(null);
      })

      it("is not present if the post is not public", function(){
        this.statusMessage.set({"public" : false});

        var view = new App.Views.Post({model : this.statusMessage}).render();
        var statusElement = $(view.el)

        expect(statusElement.find(".reshare_action").html()).toBeNull();
      })
    })

    context("Like link", function(){
      beforeEach(function(){
        this.view = new App.Views.Post({model : this.statusMessage})
        this.link = function(){ return this.view.$(".like_action"); }
      })

      it("clicking 'Like' toggles appropriately", function(){
        this.statusMessage.set({user_like : null});
        this.view.render();

        expect(this.link().text()).toContain('Like');
        this.link().click();
        expect(this.link().text()).toContain('Unlike');
        expect($(this.view.el).html()).toContain('1 like');
      })

      it("clicking 'Unlike' toggles appropriately", function(){
        this.statusMessage.set({user_like : { id : 1 }});
        this.view.render();

        expect(this.link().text()).toContain('Unlike');
        this.link().click();
        expect(this.link().text()).toContain('Like');
        expect($(this.view.el).html()).toNotContain('1 Like');
      })
    })
  })
})