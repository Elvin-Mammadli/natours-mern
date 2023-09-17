import axios from 'axios';
import { showAlert } from './alerts';

const stripe = new Stripe(
  'pk_test_51LxPU8KatriNmqF4fnWOU5ZDMceU3uCdktwINilfSFpiM7vRpeFtLOUKNw3MddZKVMVRaW6FHl0DR5LtlxBikoXo00P69m1lpS',
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
