const express=require('express')
const cors=require('cors')
const req=require('request');
const app=express()

app.use(cors())


//FBappid 352217348744266
//"http://svcs.ebay.com/MerchandisingService?OPERATION-NAME=getSimilarItems&SERVICE-NAME=MerchandisingService&SERVICE-VERSION=1.1.0&CONSUMER-ID=SagarShu-USCHW6-PRD-116e557a4-fbe3149c&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&itemId=183383599015&maxResults=20"
//APIkey google - AIzaSyCUMNx1tT-8wNaBm_2x-5oS_OSNpWA0MSM
// Search engine ID 005325147766991334352:wbuzaqurjd8


var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

const baseurl="http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=SagarShu-USCHW6-PRD-116e557a4-fbe3149c&RESPONSE-DATA-FORMAT=JSON&RESTPAY-LOAD&paginationInput.entriesPerPage=50"
  
app.get("/itemResult",(request,response)=>{
    let data=request.query;
    let url=baseurl;
    let i=0;
    url=url+"&keywords="+encodeURIComponent(data.keyword)
    url=url+"&buyerPostalCode="+data.Zip;
    if(data.Distance==''){
        url=url+"&itemFilter("+i+").name=MaxDistance&itemFilter("+i+").value=10";
    }
    else{
        url=url+"&itemFilter("+i+").name=MaxDistance&itemFilter("+i+").value="+data.Distance;
    }
    i++;
    let Shipping=JSON.parse(data.Shipping)
    url=url+"&itemFilter("+i+").name=FreeShippingOnly&itemFilter("+i+").value="+Shipping.Free
    i++;
    url=url+"&itemFilter("+i+").name=LocalPickupOnly&itemFilter("+i+").value="+Shipping.Local
    i++;
    url=url+"&itemFilter("+i+").name=HideDuplicateItems&itemFilter("+i+").value=true"
    i++;

    //&itemFilter(4).name=Condition&itemFilter(4).value(0)=New&itemFilter(4).value(1)=Used&itemFilter(4).value(2)=Unspecified
    if(data.New=='true'||data.Used=='true'||data.Unspecified=='true'){

        let k=0;
        url=url+"&itemFilter("+i+").name=Condition";
        if(data.New=='true'){
            url=url+"&itemFilter("+i+").value("+k+")=New"
            k++;
        }
        if(data.Used=='true'){
            url=url+"&itemFilter("+i+").value("+k+")=Used"
            k++;
        }
        if(data.Unspecified=='true'){
            url=url+"&itemFilter("+i+").value("+k+")=Unspecified"
            k++;
        }
        i++;
    }
    if(data.category!="AllCategories"){
        url=url+"&categoryId="+data.category;
    }
    url=url+"&outputSelector(0)=SellerInfo&outputSelector(1)=StoreInfo";

    req({
        uri:url
     },function(err,res,body){
        var result=JSON.parse(body)
        response.send(result);
    });
})


//http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=SagarShu-USCHW6-PRD-116e557a4-fbe3149c&RESPONSE-DATA-FORMAT=JSON&RESTPAY-LOAD&paginationInput.entriesPerPage=50&keywords=television&buyerPostalCode=12304&itemFilter(0).name=MaxDistance&itemFilter(0).value=10&itemFilter(1).name=FreeShippingOnly&itemFilter(1).value=false&itemFilter(2).name=LocalPickupOnly&itemFilter(2).value=false&itemFilter(3).name=HideDuplicateItems&itemFilter(3).value=true&itemFilter(4).name=Condition&itemFilter(4).value(0)=New&outputSelector(0)=SellerInfo&outputSelector(1)=StoreInfo

app.get("/",(request,response)=>{
    response.send("Homework 8 Node server is ON..");
})

app.get("/itemDetails/:id",(request,response)=>{
    req({
        uri:"http://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=SagarShu-USCHW6-PRD-116e557a4-fbe3149c&siteid=0&version=967&ItemID="+request.params.id+"&IncludeSelector=Description,Details,ItemSpecifics"
        // uri:"http://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=SagarShu-USCHW6-PRD-116e557a4-fbe3149c&siteid=0&version=967&ItemID=183383599015&IncludeSelector=Description,Details,ItemSpecifics"
    },function(err,res,body){
        var result=JSON.parse(body)
        response.send(result);
    });
})
app.get("/photos/:title",(request,response)=>{
    
    req({
        uri:"https://www.googleapis.com/customsearch/v1?q="+request.params.title+"&cx=005325147766991334352:wbuzaqurjd8&imgSize=huge&imgType=news&num=8&searchType=image&key=AIzaSyCUMNx1tT-8wNaBm_2x-5oS_OSNpWA0MSM"
       },function(err,res,body){
        var result=JSON.parse(body)
        response.send(result);
    });
})


app.get("/getSimilarItems/:id",(request,response)=>{
    req({
        // uri:"http://svcs.ebay.com/MerchandisingService?OPERATION-NAME=getSimilarItems&SERVICE-NAME=MerchandisingService&SERVICE-VERSION=1.1.0&CONSUMER-ID=SagarShu-USCHW6-PRD-116e557a4-fbe3149c&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&" +"itemId="+ req.params.itemTitle + "&maxResults=20";
        uri:"http://svcs.ebay.com/MerchandisingService?OPERATION-NAME=getSimilarItems&SERVICE-NAME=MerchandisingService&SERVICE-VERSION=1.1.0&CONSUMER-ID=SagarShu-USCHW6-PRD-116e557a4-fbe3149c&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&itemId="+request.params.id+"&maxResults=20"
       },function(err,res,body){
        var result=JSON.parse(body)
        response.send(result);
    });
})

app.get("/getZipcodes/:text",(request,response)=>{
    req({
        uri:"http://api.geonames.org/postalCodeSearchJSON?postalcode_startsWith="+request.params.text+"&username=srshukla&country=US&maxRows=5"
       },function(err,res,body){
        var result=JSON.parse(body)
        response.send(result);
    });
})


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("on");
});
// app.listen(3000,()=>console.log("on"))