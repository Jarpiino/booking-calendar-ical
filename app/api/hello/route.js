import { NextResponse } from "next/server";

import ical from "node-ical";
export async function GET() {
  const data = await ical.async.fromURL(process.env.REACT_APP_BOOKING);
  // console.log(process.env.REACT_APP_BOOKING_API_URL);

  return NextResponse.json({ data });
}
