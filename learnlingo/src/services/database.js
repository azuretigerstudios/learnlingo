import { ref, get, query, orderByKey, startAfter, limitToFirst, push, set } from "firebase/database";
import { db } from "./firebase";

/**
 * Öğretmen listesini parçalı (pagination) olarak çeker.
 * @param {string|null} lastKey - Son yüklenen öğretmenin ID'si (ilk yüklemede null).
 * @param {number} pageSize - Kaç kayıt çekilecek (Varsayılan: 4).
 */
export const fetchTeachers = async (lastKey = null, pageSize = 4) => {
  try {
    const teachersRef = ref(db, "teachers");
    let teachersQuery;

    if (lastKey) {
      // Eğer bir son anahtar varsa, ondan sonrakinden başla
      teachersQuery = query(
        teachersRef,
        orderByKey(),
        startAfter(lastKey),
        limitToFirst(pageSize)
      );
    } else {
      // İlk yükleme
      teachersQuery = query(
        teachersRef,
        orderByKey(),
        limitToFirst(pageSize)
      );
    }

    const snapshot = await get(teachersQuery);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Veriyi diziye çeviriyoruz ve ID'yi ekliyoruz
      return Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Öğretmenler çekilirken hata oluştu:", error);
    throw error;
  }
};

/**
 * Deneme dersi rezervasyonunu kaydeder.
 * @param {object} bookingData - Formdan gelen öğrenci ve ders bilgileri.
 */
export const saveTrialLesson = async (bookingData) => {
  try {
    const bookingsRef = ref(db, "bookings");
    const newBookingRef = push(bookingsRef); // Benzersiz bir ID oluşturur
    await set(newBookingRef, {
      ...bookingData,
      createdAt: new Date().toISOString()
    });
    return { success: true, id: newBookingRef.key };
  } catch (error) {
    console.error("Rezervasyon kaydedilemedi:", error);
    throw error;
  }
};

/**
 * Kullanıcının favori listesini günceller.
 * @param {string} userId - Mevcut kullanıcı ID'si.
 * @param {string} teacherId - Favoriye eklenen/çıkarılan öğretmen ID'si.
 * @param {boolean} isFavorite - Favori durumu.
 */
export const updateFavoriteStatus = async (userId, teacherId, isFavorite) => {
  try {
    const favoriteRef = ref(db, `users/${userId}/favorites/${teacherId}`);
    if (isFavorite) {
      await set(favoriteRef, true);
    } else {
      await set(favoriteRef, null); // Değeri null yapmak Firebase'de o kaydı siler
    }
  } catch (error) {
    console.error("Favori durumu güncellenemedi:", error);
    throw error;
  }
};

/**
 * Kullanıcının tüm favori öğretmen ID'lerini getirir.
 */
export const getUserFavorites = async (userId) => {
  try {
    const snapshot = await get(ref(db, `users/${userId}/favorites`));
    if (snapshot.exists()) {
      return Object.keys(snapshot.val());
    }
    return [];
  } catch (error) {
    console.error("Favoriler çekilemedi:", error);
    return [];
  }
};