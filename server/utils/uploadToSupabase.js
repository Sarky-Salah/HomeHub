// server/util/uploadToSupabase.js

const supabase = require("../config/supabase");

const uploadToSupabase = async (file, bucket) => {

    const sanitizedName = file.originalname
    .replace(/[^a-zA-Z0-9.-]/g, "_");

    const fileName =
        `${Date.now()}-${sanitizedName}`;

    const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file.buffer, {
            contentType: file.mimetype
        });

    if (error) {
        console.log("SUPABASE UPLOAD ERROR:", error);
    
        throw new Error(
            `Invalid file name: ${file.originalname}. Please rename the file and remove special characters such as [ ] ( ) # % & before uploading.`
        );
    }
    
    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

    return data.publicUrl;
};

module.exports = uploadToSupabase;