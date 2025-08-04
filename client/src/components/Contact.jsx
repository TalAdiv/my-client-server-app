// src/components/Contact.jsx
import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';

function Contact() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        'service_aahk7m6', // השירות שלך
        'template_hgcpobq', // התבנית שלך
        form.current,
        'DozbVqJBql2vyXUv3' // ה-User ID
      )
      .then(
        () => {
          alert('ההודעה נשלחה בהצלחה!');
          form.current.reset();
        },
        (error) => {
          console.error('שליחת המייל נכשלה:', error);
          alert('שליחה נכשלה. נסה שוב.');
        }
      );
  };

  return (
    <main>
      <h2>רוצים טיול מותאם אישית? 
        <br /> <br />צרו קשר</h2>
      <form ref={form} onSubmit={sendEmail} id="contact-form">
        <label>
          שם:
          <input type="text" name="name" required />
        </label>
        <label>
          אימייל:
          <input type="email" name="email" required />
        </label>
        <label>
          הודעה:
          <textarea name="message" required></textarea>
        </label>
        <button type="submit">שלח</button>
      </form>
    </main>
  );
}

export default Contact;
