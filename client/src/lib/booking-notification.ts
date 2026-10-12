import emailjs from '@emailjs/browser';
import type { InsertBookingInquiry } from '@shared/schema';

export async function sendBookingNotification(data: InsertBookingInquiry) {
  await emailjs.send('service_i65l3ak', 'template_3ju4pvr', {
    from_name: data.name, from_email: data.email, phone: data.phone,
    check_in: data.checkIn, check_out: data.checkOut, guests: data.guests,
    message: data.message || 'No additional message', reply_to: data.email,
  }, '_-f5oA_eoI9biq5jw');
}
