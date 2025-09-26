import { EnvelopeIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useReducer } from "react";

// Aşağıdaki InviteUsers bileşeni, e-posta ile ekip üyesi davet etme işlemini gerçekleştirmektedir.
// Ancak şu anda herhangi bir state yönetimi bulunmamaktadır ve bileşen kullanıcı etkileşimine tepki vermemektedir.
// Amacınız useReducer kullanarak tam işlevsel bir davet bileşeni oluşturmak ve kullanıcı geri bildirimini iyileştirmektir.

// ✅ useReducer kullanarak e-posta adreslerini array içinde saklayın ve eklenen her e-postayı listeleyin.
// ✅ Kullanıcı  e-posta adresi eklediğinde ekrana "Ekip üyesi eklendi" yerine, eklenen gerçek e-posta adresini gösterin.
// ✅ Kullanıcı yanlış formatta bir e-posta adresi girerse, input'un altına bir hata mesajı ekleyin (örn: "Geçersiz e-posta adresi").
// ✅ Kullanıcının aynı e-posta adresini iki kez eklemesini önleyin ve uyarı mesajı gösterin.
// ✅ Kullanıcı eklenen e-postaları tek tek silebilmeli. Bir çöp kutusu ikonu ekleyerek her eklenen e-posta için "Sil" butonu oluşturun.

// Bonus:
// ✨ Input alanının içini Tailwind'in before: ve after: pseudo-elementleriyle süsleyin (E-posta simgesi, animasyonlu bir underline).
// ✨ Kullanıcı hata mesajı aldığında input’un çerçevesi kırmızı renkte yanıp sönsün (animate-pulse).
// ✨ Eklenen e-posta adresleri için bir "etiket sistemi" oluşturun: Her e-posta adresi buton şeklinde bir etikete dönüştürülsün (bg-indigo-100 text-indigo-700 rounded-full px-2 py-1).
// ✨ Input alanı boşken buton disabled olsun ve opacity-50 cursor-not-allowed ile soluk görünsün.
// ✨ Kullanıcı bir e-posta eklediğinde, input alanı shake (titreme) animasyonu ile tepki versin (animate-wiggle gibi).
// ✨ Kullanıcı input'a tıklayınca, placeholder kaybolarak yukarı çıkacak şekilde bir efekt ekleyin (peer-placeholder-shown).

const initialState = {
  team: [],
  text: "",
  error: "",
  success: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "change":
      return { ...state, text: action.payload, error: "", success: "" };

    case "submit": {
      const email = state.text;

      if (!email) {
        return { ...state, error: "Lütfen bir e-posta giriniz." };
      }
      if (state.team.includes(email)) {
        return { ...state, error: "Bu e-posta zaten eklenmiş." };
      }

      return {
        ...state,
        team: [...state.team, email],
        text: "",
        success: `${email} eklendi!`,
        error: "",
      };
    }

    case "remove":
      return {
        ...state,
        team: state.team.filter((e) => e !== action.payload),
        success: "",
        error: "",
      };

    default:
      return state;
  }
}

export default function InviteUsers() {
  const [form, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: "submit" });
  };

  return (
    <div className="mx-auto p-8 max-w-lg">
      <Header />
      <form className="mt-6 flex" onSubmit={handleSubmit}>
        <label htmlFor="email" className="sr-only">
          E-mail adresiniz
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={form.text}
          onChange={(e) =>
            dispatch({ type: "change", payload: e.target.value })
          }
          className={`px-2 block w-full rounded-md border py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 
          focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6
          ${
            form.error
              ? "border-red-500 animate-pulse"
              : "border-gray-300 focus:ring-indigo-600"
          }`}
          placeholder="E-posta giriniz"
        />
        <button
          type="submit"
          disabled={!form.text}
          className={`ml-4 flex-shrink-0 rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm 
          ${
            form.text
              ? "bg-indigo-600 hover:bg-indigo-500"
              : "bg-gray-400 opacity-50 cursor-not-allowed"
          }`}
        >
          Davetiye gönderin
        </button>
      </form>

      {/* Hata mesajı */}
      {form.error && <p className="mt-2 text-sm text-red-600">{form.error}</p>}

      {/* Başarı mesajı */}
      {form.success && (
        <p className="mt-2 text-sm text-green-600">{form.success}</p>
      )}

      {/* Ekip listesi */}
      <div className="mt-6 flex flex-wrap gap-2">
        {form.team.map((email) => (
          <span
            key={email}
            className="flex items-center bg-indigo-100 text-indigo-700 rounded-full px-3 py-1 text-sm"
          >
            {email}
            <button
              type="button"
              onClick={() => dispatch({ type: "remove", payload: email })}
              className="ml-2 text-red-600 hover:text-red-800"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="text-center">
      <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h2 className="mt-2 text-base font-semibold leading-6 text-gray-900">
        Ekip üyelerini davet edin
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Projenize henüz herhangi bir ekip üyesi eklemediniz. Projenin sahibi
        olarak, ekip üyesi izinlerini yönetebilirsiniz.
      </p>
    </div>
  );
}
