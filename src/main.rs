extern crate libc;
extern crate rand;
use rand::Rng;
use std::mem;

#[no_mangle]
pub fn gray_scale (pixel_data: *mut u8, length: isize) {
    let mut i = 0;
    unsafe {
<<<<<<< HEAD
        while i + 3 <= length {
=======
        while i < length {
>>>>>>> dfc0fa178591c2bc7effc4f0a183141f814556d5
            *pixel_data.offset(i + 1) = *pixel_data.offset(i);
            *pixel_data.offset(i + 2) = *pixel_data.offset(i);
            i += 4;
        }
    }
}

#[no_mangle]
pub fn invert (pixel_data: *mut u8, length: isize) {
    let mut i = 0;
    unsafe {
<<<<<<< HEAD
        while i + 3 <= length {
=======
        while i < length {
>>>>>>> dfc0fa178591c2bc7effc4f0a183141f814556d5
            *pixel_data.offset(i) = 255_u8 - *pixel_data.offset(i);
            *pixel_data.offset(i + 1) = 255_u8 - *pixel_data.offset(i + 1);
            *pixel_data.offset(i + 2) = 255_u8 - *pixel_data.offset(i + 2);
            i += 4;
        }
    }
}

#[no_mangle]
pub fn noise (pixel_data: *mut u8, length: isize) {
    let mut i = 0;
    let mut rng = rand::thread_rng();
    let mut random: u8;
    unsafe {
<<<<<<< HEAD
        while i + 3 <= length {
=======
        while i < length {
>>>>>>> dfc0fa178591c2bc7effc4f0a183141f814556d5
            random = (rng.gen::<u8>() % 70).saturating_sub(35);
            *pixel_data.offset(i) = (*pixel_data.offset(i)).saturating_add(random);
            *pixel_data.offset(i + 1) = (*pixel_data.offset(i + 1)).saturating_add(random);
            *pixel_data.offset(i + 2) = (*pixel_data.offset(i + 2)).saturating_add(random);
            *pixel_data.offset(i + 3) = (*pixel_data.offset(i + 3)).saturating_add(random);
            i += 4;
        }
    }
}

#[no_mangle]
pub fn brighten (pixel_data: *mut u8, length: isize, brightness: u8) {
    let mut i = 0;
    unsafe {
<<<<<<< HEAD
        while i + 3 <= length {
=======
        while i < length {
>>>>>>> dfc0fa178591c2bc7effc4f0a183141f814556d5
            *pixel_data.offset(i) = (*pixel_data.offset(i)).saturating_add(brightness);   
            *pixel_data.offset(i + 1) = (*pixel_data.offset(i + 1)).saturating_add(brightness);   
            *pixel_data.offset(i + 2) = (*pixel_data.offset(i + 2)).saturating_add(brightness);   
            i += 4;
        }
    }
}

fn get_pixel (pixel_data: *mut u8, width: isize, height: isize, x: isize, y: isize) -> isize {
    let mut pixel = 0;
    if (x >= 0_isize) || (y >= 0_isize) || (x < (width)) || (y < (height)) {
        unsafe {
            pixel = *pixel_data.offset((width * y) + x);
        }    
    }
    return pixel as isize;
}

#[no_mangle]
pub fn sobel_filter (pixel_data: *mut u8, width: isize, height: isize, invert: bool) {
    let gray_data: *mut u8;
    unsafe {
        gray_data = libc::malloc((width * height) as usize * mem::size_of::<u8>()) as *mut u8;
    }

    let mut x: isize;
    let mut y: isize;

    for y in 0..height {
        for x in 0..width {
            let offset = (((width * y) + x) << 2) as isize;
            unsafe {
                let r = *pixel_data.offset(offset);
                let g = *pixel_data.offset(offset + 1);
                let b = *pixel_data.offset(offset + 2);
                let avg = (r >> 2) + (g >> 1) + (b >> 3);
                *gray_data.offset((width * y) + x) = avg;

                *pixel_data.offset(offset) = avg;
                *pixel_data.offset(offset + 1) = avg;
                *pixel_data.offset(offset + 2) = avg;
                *pixel_data.offset(offset + 3) = 255;
            }
        }
    }

    for y in 0..height {
        for x in 0..width {
            let mut new_x: isize = 0;
            let mut new_y: isize = 0;
            if (0 < x || width - 1 > x) || (0 < y || height - 1 > y) {
                new_x =
                    get_pixel(gray_data, width, height, x + 1, y - 1) +
                    (get_pixel(gray_data, width, height, x + 1, y) << 1) +
                    get_pixel(gray_data, width, height, x + 1, y + 1) -
                    get_pixel(gray_data, width, height, x - 1, y - 1) -
                    (get_pixel(gray_data, width, height, x - 1, y) << 1) -
                    get_pixel(gray_data, width, height, x - 1, y + 1);
                new_y =
                    get_pixel(gray_data, width, height, x - 1, y + 1) +
                    (get_pixel(gray_data, width, height, x, y + 1) << 1) +
                    get_pixel(gray_data, width, height, x + 1, y + 1) -                    
                    get_pixel(gray_data, width, height, x - 1, y - 1) -
                    (get_pixel(gray_data, width, height, x, y - 1) << 1) -
                    get_pixel(gray_data, width, height, x + 1, y - 1);
            }
            let mut mag: u8 = (((new_x * new_x) + (new_y * new_y)) as f64).sqrt() as u8;
            if invert {
                mag = 255 - mag;
            }
            let offset: isize = ((width * y) + x) << 2;
            unsafe {
                *pixel_data.offset(offset) = mag;
                *pixel_data.offset(offset + 1) = mag;
                *pixel_data.offset(offset + 2) = mag;
                *pixel_data.offset(offset + 3) = 255;
            }
        }
    }    
}

fn main() {
//
}