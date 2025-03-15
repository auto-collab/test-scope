import { NextResponse } from 'next/server';

import { getTestResults } from '@/app/api/azure/service/test-results-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pipelineName = searchParams.get('pipelineName');

  if (!pipelineName) {
    return NextResponse.json(
      { error: 'pipelineName is required' },
      { status: 400 },
    );
  }

  try {
    const testResults = await getTestResults(pipelineName);
    return NextResponse.json(testResults);
  } catch (error: unknown) {
    console.error('Error fetching test results:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch test results.',
        details: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
