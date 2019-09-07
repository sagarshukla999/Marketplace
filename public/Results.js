var form=angular.module('form',['ngMaterial', 'ngMessages','angular-svg-round-progressbar','ngAnimate'])

form.controller('FormController', function($scope,$http) {
    var formdetails={ category:"AllCategories",
        New:false,
        Used:false,
        Unspecified:false,
        Shipping:{Free:false,Local:false},
        Distance: '',
        keyword:""
    }
    $scope.firstload=1;
    $scope.openinNewtab=function(url){
        window.open(url,'_blank')
    }
   
    $scope.serverURL="https://marketplace-1554111139715.appspot.com"
    //$scope.serverURL="http://localhost:3000"

    $scope.activeSubTab="Product"
    $scope.mainTab="Results"
    var location=true;
    var loc="current";

    var changeTotal=function (loc){
        //formdetails.zipcode=""
        this.location=loc;
        this.searchZip="";
        this.ziplength=false;
        //document.getElementById("input-0").value = "";
            $scope.form.autocompleteField.$setUntouched();
           //$scope.form.autocompleteField.selectedI="";
    }

    $scope.changeMainTab=function(tab){
        this.mainTab=tab
    }

    var clear=function (){
        formdetails.keyword=""
        formdetails.Distance=""
        formdetails.category="AllCategories"
        formdetails.New=false
        formdetails.Used=false
        formdetails.Unspecified=false
        formdetails.Shipping.Free=false
        formdetails.Shipping.Local=false
        this.location=true;
        this.searchZip="";
        this.ziplength=false;
        $scope.form.Keyword.$setUntouched();
        $scope.form.autocompleteField.$setUntouched();
        // delete formdetails.keyword;
        document.getElementById("current").checked = true;
        document.getElementById("other").checked = false;
        $scope.show="";
        $scope.show2 = '1'
        $scope.firstLoad=true;
        $scope.mainTab='Results';
        $scope.selectedItemIndex=""
        $scope.selectedItemID=undefined;
        $scope.selectedItemDetails={}
        $scope.Allresults=""
        $scope.results ="";
        $scope.count=false;
        $scope.Reason="No Records"
    }
    
    var addWishlist=function(index,id){     
        $scope.totalCost=parseFloat($scope.totalCost)+parseFloat($scope.Allresults[index].sellingStatus[0].currentPrice[0].__value__)
        
        localStorage.totalCost = $scope.totalCost
        $scope.wishlist[id] = $scope.Allresults[index]
        //localStorage.setItem("wishlist", this.wishlist);
        $scope.wishlistsize()
        localStorage.wishlist = JSON.stringify($scope.wishlist);   
    }

    var deleteWishlist=function(id){
        $scope.totalCost=$scope.totalCost-parseFloat($scope.wishlist[id].sellingStatus[0].currentPrice[0].__value__)
        $scope.totalCost=parseFloat($scope.totalCost).toFixed(2)
        delete $scope.wishlist[id]
        //localStorage.setItem("wishlist", this.wishlist);
        localStorage.wishlist = JSON.stringify($scope.wishlist);
        localStorage.totalCost = $scope.totalCost
        $scope.wishlistsize()
    }
    $scope.wishlistsize=function(){
        $scope.wishlistsizeval=Object.keys($scope.wishlist).length;
        localStorage.wishlistsizeval = $scope.wishlistsizeval;
    }
    $scope.switchSubtab=function(tab){
        $scope.activeSubTab=tab;
    }

    $scope.selectedItem=function(index){
        if(index==undefined){
            $scope.selectedItemIndex=undefined;
            $scope.selectedItemID=undefined
            $scope.selectedItemDetails=undefined
        }
        
    }
 
    
    $scope.getItemDetails=function(itemId,title,index){
        if(index=="NA"){
            $scope.selectedItemIndex=undefined;
            $scope.selectedItemID=itemId;
            $scope.selectedItemDetails=$scope.wishlist[itemId];
        }
        else{
            $scope.selectedItemIndex=index;
            //console.log("Yo");
            
            $scope.selectedItemID=parseInt($scope.Allresults[index].itemId[0]);
            $scope.selectedItemDetails=$scope.Allresults[index];
            //console.log($scope.selectedItemDetails)
        }
        
       
        //$scope.loading=true;
        //$scope.show="itemInfo"
        $scope.activeSubTab='Product'

        $http({
            method: 'GET',
           url:$scope.serverURL+'/itemDetails/'+encodeURI(itemId), 
         }).then(function (response){
            //console.log(response.data);
           $scope.itemDetails=response.data
           
           var color=response.data.Item.Seller.FeedbackRatingStar;
           color = color.replace('Shooting','');
           $scope.myStyle={"color":color}
            
            //$scope.loading=false;
         },function (error){
            console.log(error);
         });
         title = title.replace('/','');
         $http({
            method: 'GET',
           url:$scope.serverURL+'/photos/'+encodeURI(title), 
         }).then(function (response){
            if(response.data.queries.request[0].totalResults==0){
                $scope.noimages=true;
            }
            else{
                $scope.noimages=false
            }
           $scope.photos=response.data
            //$scope.loading=false;
         },function (error){
            console.log(error);
         });

         $http({
            method: 'GET',
           url:$scope.serverURL+'/getSimilarItems/'+itemId, 
         }).then(function (response){
             $scope.getSimilarItems=response.data.getSimilarItemsResponse.itemRecommendations.item;
             for(let i=0;i<$scope.getSimilarItems.length;i++){
                $scope.getSimilarItems[i].timeLeft=parseInt($scope.getSimilarItems[i].timeLeft.substring($scope.getSimilarItems[i].timeLeft.indexOf("P")+1, $scope.getSimilarItems[i].timeLeft.indexOf("D"))); 
                $scope.getSimilarItems[i].buyItNowPrice.__value__=parseFloat($scope.getSimilarItems[i].buyItNowPrice.__value__);
                $scope.getSimilarItems[i].shippingCost.__value__=parseFloat($scope.getSimilarItems[i].shippingCost.__value__)
            }
            
            if($scope.getSimilarItems.length>5){
                $scope.limit=5;
                $scope.showMoreButton=true;
                $scope.showLessButton=false;
            }
            else{
                $scope.limit=$scope.getSimilarItems.length
                $scope.showMoreButton=false;
                $scope.showLessButton=false;
            }
         },function (error){
            console.log(error);
        });  
    }
    $scope.showMore = function(){
        $scope.showMoreButton=false;
        $scope.showLessButton=true;
        $scope.limit=$scope.getSimilarItems.length;
    }
    $scope.showLess = function(){
        $scope.showMoreButton=true;
        $scope.showLessButton=false;
        $scope.limit=5;
    }

    $scope.sortColumn="";
    $scope.ascdsc="+";
    $scope.order="+";
    $scope.sorting=function(){
        if($scope.sortColumn==""){
            $scope.order="+";
        }
        else{
            $scope.order=$scope.ascdsc+$scope.sortColumn; 
        }
    }
    


    //"http://api.geonames.org/postalCodeSearchJSON?postalcode_startsWith=900&username=[Username]&country=US&maxRows=5"
    //http://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=SagarShu-USCHW6-PRD-116e557a4-fbe3149c&siteid=0&version=967&ItemID=132961484706&IncludeSelector=Description,Details,ItemSpecifics
    




    $scope.getNumber = function(num) {
        return new Array(num);   
    }
 
    $scope.activePage=function(page){
        $scope.results = $scope.Allresults.slice((page*10)-10,page*10);
        $scope.activepage=page;
    }
    
    $scope.firstLoad=true;
    $scope.search=function(){
        $scope.selectedItemIndex=""
        $scope.selectedItemID=undefined;
        $scope.selectedItemDetails={}
        $scope.changeMainTab('Results');
        $scope.selectedItem(undefined);
        $scope.show2='1';
        $scope.show='resultTable';
        let searchParams=formdetails;
        $scope.selectedItem(undefined)
        if(document.getElementById("current").checked){
            searchParams["Zip"]=document.getElementById("currentZip").value
        }
        else{
            searchParams["Zip"]=this.searchZip;
        }
        $scope.mainTab="Results"
        $scope.loading=true;
        var Allresults;
        $http({
            method: 'GET',
           url:$scope.serverURL+'/itemResult', 
           params: searchParams
         }).then(function (response){
            $scope.show="resultTable";
            setTimeout(()=>{ $scope.loading=false;
                // $scope.show='resultTable'
                $scope.$digest();
                }, 800);
            $scope.firstLoad=false; 
            if(response.data.findItemsAdvancedResponse[0].ack[0]=="Success"){
                if(response.data.findItemsAdvancedResponse[0].searchResult[0]["@count"]!="0"){
                    $scope.count=true;
                    Allresults=response.data.findItemsAdvancedResponse[0].searchResult[0].item
                    var results = Allresults.slice(0, 10);
                    $scope.results=results
                    $scope.Allresults=Allresults;
                    pages=Allresults.length/10;
                    pages=Math.ceil(pages);
                    $scope.pages=pages;
                    $scope.activepage=1
                }
                else{
                    $scope.Reason="No Records"
                    $scope.count=false;
                    //"No Records have been found";
                }
            }
            else{
                $scope.Reason=response.data.findItemsAdvancedResponse[0].errorMessage[0].error[0].message[0]
            }
           
         },function (error){
            console.log(error);
         });  
    }
    $scope.FBapi=function(){
        var url="https://www.facebook.com/sharer.php?display=page&u= "+encodeURIComponent($scope.selectedItemDetails.viewItemURL)+"&quote="+encodeURIComponent($scope.selectedItemDetails.title[0]);
        window.open(url, "_blank");
    }

    $scope.ipapizip=true;
    $(document).ready(function(){
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2&appId=352217348744266&autoLogAppEvents=1";
            fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));
        //localStorage.clear();
        if(localStorage.getItem('wishlist')){
            $scope.wishlist=JSON.parse(localStorage.getItem('wishlist'));
            $scope.totalCost=parseFloat(localStorage.getItem('totalCost'))
            $scope.wishlistsizeval=parseInt(localStorage.getItem('wishlistsizeval'))
        }
        else{
            $scope.wishlist={};
        $scope.totalCost=0.0;
        $scope.wishlistsizeval=0;
        }
        
        $http({
            method: 'GET',
           url:'http://ip-api.com/json/', 
         }).then(function (response){
             //console.log(response)
            formdetails.currentZip=response.data.zip;
            $scope.ipapizip=false;
         },function (error){
            console.log(error);
         });  
    });

  

        $scope.show2 = '1'
        $scope.hello2=function(w,show){
            //$scope.loading1=true
            //$scope.show1='x'
            $scope.show2 = 'hide'
            $scope.show1 = '-1'
            
            setTimeout(()=>{ //$scope.loading1=false;
                $scope.show1 = w
                $scope.show2 = w;
                $scope.show=show
                $scope.$digest();
                }, 1000);
               
        }

        $scope.getSimilarItemss=function(id){
            $http({
                method: 'GET',
               url:$scope.serverURL+'/getSimilarItems/'+id, 
             }).then(function (response){
                $scope.TotalSimilarItemsResponse=response.data.getSimilarItemsResponse.itemRecommendations.item;
                if(this.TotalSimilarItemsResponse>5){
                    $scope.getSimilarItems=this.TotalSimilarItemsResponse.slice(0,4);
                    $scope.showmoreButton=true;
                    $scope.showlessButton=false;
                }
                else{
                    $scope.getSimilarItems=this.TotalSimilarItemsResponse;
                    $scope.showmoreButton=false;
                    $scope.showlessButton=false;
                }
             },function (error){
                console.log(error);
            });  
            
        }


    $scope.formdetails= formdetails
    $scope.changeTotal=changeTotal
    $scope.location=location
    $scope.clear=clear
    $scope.loc=loc
    $scope.addWishlist=addWishlist
    $scope.deleteWishlist=deleteWishlist

    $scope.myDta = [];
    var ziplength=false;
    $scope.searchZip;
    $scope.zipchange=function(text){
        if(text!=undefined){
        if(text.length==5){
            this.ziplength=true;
        }
        else{
            this.ziplength=false;
        }}
        
    }
    
    $scope.getMatches = function (text) {
        if(text.length==5){
            this.ziplength=true;
        }
        else{
            this.ziplength=false;
        }
        
        return $http
        .get($scope.serverURL+"/getZipcodes/"+text)
        .then(function(response) {
            this.myDta=response.data.postalCodes
            return this.myDta;
        });
       
    }
    $scope.ziplength=ziplength
});


