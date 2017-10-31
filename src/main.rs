// extern crate rand;
// use rand::Rng;

fn gray_scale (pixel_data: &mut [u8], length: usize) {
    let mut i = 0;
  
    while i < length {
        pixel_data[i + 1] = pixel_data[i];
        pixel_data[i + 2] = pixel_data[i];
        
        i += 4;
    }
}

fn invert (pixel_data: &mut [u8], length: usize) {
    let mut i = 0;
    let len = pixel_data.len();

    while i < len {
        pixel_data[i] = 255 - pixel_data[i];
        pixel_data[i + 1] = 255 - pixel_data[i + 1];
        pixel_data[i + 2] = 255 - pixel_data[i + 2];
        pixel_data[i + 3] = 255 - pixel_data[i + 3];
        
        i += 4;
    }
}

// fn noise (pixel_data: &mut [u8]) {
//     let mut i = 0;
//     let len = pixel_data.len();
//     let mut random = (rand::random::<u8>() % 70) - 35;

//     while i < len {

//         pixel_data[i] = pixel_data[i] + random;
//         pixel_data[i + 1] = pixel_data[i + 1] + random;
//         pixel_data[i + 2] = pixel_data[i + 2] + random;
//         pixel_data[i + 3] = pixel_data[i + 3] + random;
        
//         i += 4;
//     }

// }

fn main() {

}