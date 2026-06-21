// server/util/uploadToSupabase.js

const supabase = require("../config/supabase");

const uploadToSupabase = async (file, bucket) => {

    const fileName =
        `${Date.now()}-${file.originalname}`;

    const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file.buffer, {
            contentType: file.mimetype
        });
    if (error) throw error;

    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

    return data.publicUrl;
};

module.exports = uploadToSupabase;