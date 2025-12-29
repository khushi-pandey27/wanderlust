const listing = require("../models/listing");

module.exports.index = async(req,res)=>{
    const alllistings=await listing.find({});
    res.render("listings/index.ejs",{alllistings});   
};

module.exports.renderNewForm = (req,res)=>{
     res.render("listings/new.ejs");
};

module.exports.showListing = async(req,res)=>{
    let {id}=req.params;
    const ListingDoc=await listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    if(!ListingDoc){
        req.flash("error","Listing you requested for does not exist");
        
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing:ListingDoc});
};

module.exports.createListing = async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing= listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    const ListingDoc=await listing.findById(id);
    if(!ListingDoc){
        req.flash("error","Listing you requested for does not exist");

        return res.redirect("/listings");
    }
  
    let originalImageUrl = ListingDoc.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{ListingDoc, originalImageUrl});

};

module.exports.updateListing = async (req,res)=>{
    const { id } = req.params;
    let ListingDoc=await listing.findByIdAndUpdate(id,{...req.body.listing});
    if(req.file){ 
        let url = req.file.path;
        let filename = req.file.filename;
        ListingDoc.image = {url,filename};
        await ListingDoc.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destoryListing = async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
};