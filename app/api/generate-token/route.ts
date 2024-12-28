import { NextRequest, NextResponse } from 'next/server';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

export async function POST(request: NextRequest) {
  try {
    const { roomID, userID, userName } = await request.json();

    const appID = Number(process.env.ZEGO_APP_ID);
    const serverSecret = process.env.ZEGO_SERVER_SECRET;
    const serverUrl = process.env.ZEGO_SERVER_URL;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret || '',
      roomID,
      userID,
      userName,
      //@ts-ignore
      {
        tokenServerUrl: serverUrl,
      }
    );

    return NextResponse.json({ token: kitToken });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}