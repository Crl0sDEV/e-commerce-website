'use client'

import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

interface Props {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export default function PhoneInputCustom({ value, onChange, disabled }: Props) {
  return (
    <div className="phone-input-container">
      <PhoneInput
        international
        defaultCountry="PH"
        value={value}
        onChange={(val) => onChange(val ? val.toString() : '')}
        disabled={disabled}
        className="flex gap-2"
        numberInputProps={{
          className: "w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-black transition", // Ito yung style ng textbox para kamukha ng iba
          placeholder: "Enter phone number"
        }}
      />
      <style jsx global>{`
        .PhoneInputCountry {
          margin-right: 8px;
        }
        .PhoneInputCountrySelect {
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          z-index: 1;
          border: 0;
          opacity: 0;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}