import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import db from './firebase'
import GoogleMapsWrapper from './components/GoogleMapsWrapper'
import LocationSelector from './components/LocationSelector.jsx'
import { useSwipeable } from 'react-swipeable'
import Lottie from 'lottie-react'
import interiorAnim from './lotties/interior.json'
import exteriorAnim from './lotties/exterior.json'
import fullDetailAnim from './lotties/full.json'
import ceramicAnim from './lotties/ceramic.json'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { motion } from 'framer-motion'

function App() {
  const [selected, setSelected] = useState(null)
  const [step, setStep] = useState(0)
  const [selectedDate, setSelectedDate] = useState(null)
  const [availableTimes, setAvailableTimes] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [vehicleType, setVehicleType] = useState(null)
  const [serviceLocation, setServiceLocation] = useState(null)
  const [expandedCard, setExpandedCard] = useState(null)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const services = [
    { anim: interiorAnim, label: 'Interior Detail', description: 'A level of clean you wont be afraid to let your friends see' },
    { anim: exteriorAnim, label: 'Exterior Detail', description: 'Back to like new conditions' },
    { anim: fullDetailAnim, label: 'Full-Detail', description: 'Its like a factory reset for your vehicle' },
    { anim: ceramicAnim, label: 'Ceramic Coating', description: 'Long-lasting protection' },
  ]

  // Updated pricing object reflecting detailed pricing for each vehicle type and service combination
  const pricing = {
    'Coupe/Sedan': {
      'Interior Detail': 150,
      'Exterior Detail': 125,
      'Full-Detail': 250,
      'Ceramic Coating': 150
    },
    'Small SUV/Crossover': {
      'Interior Detail': 175,
      'Exterior Detail': 150,
      'Full-Detail': 275,
      'Ceramic Coating': 175
    },
    'Large SUV/Vans': {
      'Interior Detail': 225,
      'Exterior Detail': 200,
      'Full-Detail': 325,
      'Ceramic Coating': 225
    },
    'Trucks': {
      'Interior Detail': 200,
      'Exterior Detail': 175,
      'Full-Detail': 300,
      'Ceramic Coating': 200
    }
  }

  const serviceDescriptions = {
    'Full-Detail': `Exterior\n• Professional Hand Wash\n• Clay Bar Vehicle\n• Bug and Tar Removal\n• Detail Rim Faces & Tires\n• Dress and Shine Tires\n• Dress All Exterior Plastic\n• Clean Wheel Wells\n• Minor Sap Removal\n• Ceramic Spray Coating 3 Month Protection (wax)\n• Touch Up Spot Polish\n\nInterior\n• Full Wipe Down\n• Double Vacuum Interior\n• Clean all Windows\n• Clean & Protect Plastic\n• Upholstery/carpet shampoo and extraction\n• Leather Treatment\n• Minor Pet Hair Removal\n• Minor Carpet Stain Removal\n• Detail Floor Mats\n• Detail Trunk\n• Air Freshener Treatment`,
    'Interior Detail': `• Full Wipe Down\n• Double Vacuum Interior\n• Clean all Windows\n• Clean & Protect Plastic\n• Upholstery/carpet shampoo and extraction\n• Leather Treatment\n• Minor Pet Hair Removal\n• Minor Carpet Stain Removal\n• Detail Floor Mats\n• Detail Trunk\n• Air Freshener Treatment`,
    'Exterior Detail': `• Professional Hand Wash\n• Clay Bar Vehicle\n• Bug and Tar Removal\n• Detail Rim Faces & Tires\n• Dress and Shine Tires\n• Dress All Exterior Plastic\n• Clean Wheel Wells\n• Minor Sap Removal\n• Ceramic Spray Coating 3 Month Protection (wax)\n• Touch Up Spot Polish`
  }

  const handleSelect = (label) => {
    setSelected(label)
    console.log('Selected:', label)
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => console.log('swipe left'),
    onSwipedRight: () => console.log('swipe right'),
    preventScrollOnSwipe: true,
    trackMouse: true,
  })

  // Step 5: Form submission handler (save to Firestore)
  const handleSubmit = async () => {
    const form = document.querySelector('form')

    const payload = {
      name: form.name.value,
      phone: form.phone.value,
      email: form.email.value,
      notes: form.notes.value,
      useLocation: form.useLocation.checked,
      sendReminders: form.sendReminders.checked,
      serviceLocation: serviceLocation?.address || '',
      vehicleType,
      servicePackage: selected,
      date: selectedDate ? selectedDate.toLocaleDateString() : '',
      time: selectedTime
    }

    console.log('Submitting booking to Firestore...')
    console.log('Payload:', payload)

    try {
      await addDoc(collection(db, 'bookings'), payload)
      setFormSubmitted(true)
      setStep(6)
    } catch (err) {
      console.error('Error saving to Firestore:', err)
    }
  }

  return (
    <main className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300`}>
      <header className="w-full max-w-md mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {step > 0 ? `Step ${step} of 5` : 'Location'}
        </div>
        <button onClick={() => setDarkMode(!darkMode)} className="text-sm px-3 py-1 border rounded">
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>

      {/* Step 0 replaced with step 4 GoogleMapsWrapper */}
      {step === 0 && (
        <GoogleMapsWrapper>
          <motion.div
            className="fade-step w-full max-w-md text-center"
            key="step0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h1 className="text-3xl font-bold mb-6">📍 Choose Your Location</h1>
            <LocationSelector onConfirm={({ position, address }) => {
              setServiceLocation({ position, address })
              setStep(1)
            }} />
          </motion.div>
        </GoogleMapsWrapper>
      )}

      {step === 1 && (
        <motion.div
          className="fade-step w-full max-w-xl mx-auto text-center p-6"
          key="step1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h1 className="text-2xl font-bold mb-6">🏪 Select Your Service Location</h1>
          <div
            onClick={() => setStep(2)}
            className="cursor-pointer border border-blue-500 rounded-lg p-4 shadow-md text-left hover:bg-blue-50 transition-all"
          >
            <p className="text-lg font-semibold text-blue-600">Detail-ly Auto Detailing</p>
            <p className="text-sm text-gray-600">710 S. 10th Ave, Wausau, WI</p>
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          className="fade-step w-full max-w-xl mx-auto text-center p-6"
          key="step2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h1 className="text-2xl font-bold mb-6">🚙 What type of vehicle do you have?</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {["Coupe/Sedan", "Small SUV/Crossover", "Large SUV/Vans", "Trucks"].map((type) => (
              <div
                key={type}
                onClick={() => setVehicleType(type)}
                className={`p-4 rounded-lg border shadow-sm cursor-pointer transition-all ${
                  vehicleType === type
                    ? 'border-blue-600 bg-blue-50 text-blue-800'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                <p className="text-lg font-semibold">{type}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 transition-all"
            >
              ← Back
            </button>
            <button
              disabled={!vehicleType}
              onClick={() => setStep(3)}
              className={`px-6 py-2 rounded-full transition-all ${
                vehicleType
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next →
            </button>
          </div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          className="fade-step w-full max-w-6xl mx-auto text-center p-6"
          key="step3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h1 className="text-3xl font-bold mb-6">🚗 Pick Your Detailing Package</h1>
          <p className="mb-2 text-center text-gray-500">Vehicle Type: <strong>{vehicleType}</strong></p>
          <p className="mb-8 text-center text-gray-600 italic">* Prices update based on your vehicle type</p>

          <div {...handlers} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {services.map(({ anim, label, description }) => {
              const price = pricing[vehicleType]?.[label]
              return (
                <div
                  key={label}
                  className={`cursor-pointer p-4 rounded-xl border transition-colors duration-200 shadow-sm hover:shadow-md ${
                    selected === label
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 bg-white'
                  }`}
                  onClick={() => handleSelect(label)}
                >
                  <Lottie animationData={anim} className="h-24 mx-auto" loop autoplay />
                  <h2 className="text-lg font-semibold mt-4">{label}</h2>
                  <p className="text-sm text-gray-500 mt-2">{description}</p>
                  <p className="text-md font-semibold mt-4">
                    {label === 'Ceramic Coating' ? 'Call for pricing' : `$${price?.toFixed(2)}`}
                  </p>
                  <button
                    className="text-sm text-blue-600 underline mt-2"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpandedCard(expandedCard === label ? null : label)
                    }}
                  >
                    {expandedCard === label ? 'Hide details' : 'More details'}
                  </button>
                  {expandedCard === label && (
                    <pre className="text-sm text-left text-gray-600 whitespace-pre-wrap mt-4">
                      {serviceDescriptions[label]}
                    </pre>
                  )}
                </div>
              )
            })}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 transition-all"
            >
              ← Back
            </button>
            <button
              disabled={!selected}
              onClick={() => setStep(4)}
              className={`px-6 py-2 rounded-full transition-all ${
                selected
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next →
            </button>
          </div>
        </motion.div>
      )}

      {step === 4 && (
        <motion.div
          className="fade-step w-full max-w-md text-center"
          key="step4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h1 className="text-3xl font-bold mb-6">📅 Select Date & Time</h1>

          <div className="mb-6">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              fromDate={new Date()}
              className="mx-auto"
            />
          </div>

          {selectedDate && (
            <>
              <h2 className="text-md font-semibold mb-2">Select a Time</h2>
              <div className="grid grid-cols-3 gap-2 mb-6">
                {[
                  '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
                  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
                  '5:00 PM', '6:00 PM', '7:00 PM'
                ].map((time) => (
                  <button
                    key={time}
                    className={`py-2 px-3 rounded-md border text-sm ${
                      selectedTime === time
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="flex justify-between">
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 transition-all"
            >
              ← Back
            </button>
            <button
              disabled={!selectedDate || !selectedTime}
              onClick={() => setStep(5)}
              className={`px-6 py-2 rounded-full transition-all ${
                selectedDate && selectedTime
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next →
            </button>
          </div>
        </motion.div>
      )}

      {step === 5 && (
        <motion.div
          className="fade-step w-full max-w-md text-center"
          key="step5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h1 className="text-3xl font-bold mb-6">📝 Contact & Booking Info</h1>
          <button
            onClick={() => setStep(4)}
            className="mb-4 px-6 py-2 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 transition-all"
          >
            ← Back
          </button>
          <form
            className="flex flex-col gap-6 text-left w-full"
          >
            <div>
              <label className="block font-medium mb-1">Name</label>
              <input name="name" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block font-medium mb-1">Phone</label>
              <input name="phone" type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block font-medium mb-1">Email</label>
              <input name="email" type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block font-medium mb-1">Notes (optional)</label>
              <textarea name="notes" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" rows="4" />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="useLocation"
                className="w-4 h-4"
                onChange={() => console.log('Toggle use current location')}
                name="useLocation"
              />
              <label htmlFor="useLocation" className="text-sm">Use my current location</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="sendReminders"
                className="w-4 h-4"
                onChange={() => console.log('Toggle send reminders')}
                name="sendReminders"
              />
              <label htmlFor="sendReminders" className="text-sm">Send me appointment reminders via text/email</label>
            </div>
            {/* Hidden fields for service details */}
            <input type="hidden" name="serviceLocation" value={serviceLocation?.address || ''} />
            <input type="hidden" name="vehicleType" value={vehicleType || ''} />
            <input type="hidden" name="servicePackage" value={selected || ''} />
            <input type="hidden" name="date" value={selectedDate ? selectedDate.toLocaleDateString() : ''} />
            <input type="hidden" name="time" value={selectedTime || ''} />
            <button
              type="button"
              className="w-full mt-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all font-semibold text-lg"
              onClick={handleSubmit}
            >
              Submit Booking
            </button>
          </form>
        </motion.div>
      )}

      {step === 6 && (
        <motion.div
          className="fade-step w-full max-w-md text-center"
          key="step6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h1 className="text-3xl font-bold mb-4 text-green-600">🎉 Booking Confirmed!</h1>
          <p className="text-lg text-gray-700 mb-4">Thank you for booking with us. We've received your details and will reach out shortly!</p>
          <button
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all"
            onClick={() => window.location.href = 'https://detailwausau.com'}
          >
            Finish
          </button>
        </motion.div>
      )}
    </main>
  )
}

export default App