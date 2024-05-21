import React from 'react';
import values from '@/data/values';

export default function CenterLocale({ title }) {
  const officeValues = values[title] || {};

  return (
    <div className=" w-full h-full">
      <div className=" bg-vert-claire h-full ">
        <div className="hidden lg:block text-center text-xl font-bold">{title}</div>
        <div className="grid grid-cols-2 text-sm lg:text-lg lg:gap-3 px-4 ">
          <div>{officeValues.address}</div>
          <div className="pl-6">{officeValues.phone}</div>
          <div>{officeValues.city}</div>
          <div className="pl-6">{officeValues.tollFree}</div>
          <div>{officeValues.province}</div>
          <div className="pl-6">{officeValues.fax}</div>
          <div>{officeValues.postalCode}</div>
          <div className="pl-6">{officeValues.email}</div>
        </div>
      </div>
    </div>
  );
}
