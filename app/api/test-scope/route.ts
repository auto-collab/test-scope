import { NextResponse } from 'next/server';

// import { getApplicationTestScope } from '@/backend/get-application-test-scope';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const app = searchParams.get('app') || 'MyApp';

  // TEMP MOCK DATA
  const mockData = {
    totalTests: Math.floor(Math.random() * 100) + 1,
    lastPipelineOutcomes: {
      'Pipeline A': 'Passed',
      'Pipeline B': 'Failed',
    },
    codeCoverage: [
      { module: 'Module A', coverage: Math.random() * 100 },
      { module: 'Module B', coverage: Math.random() * 100 },
      { module: 'Module C', coverage: Math.random() * 100 },
    ],
    testGroups: {
      'Storage A': [
        { testName: 'Test 1', duration: '500ms', outcome: 'Passed' },
        { testName: 'Test 2', duration: '300ms', outcome: 'Failed' },
      ],
      'Storage B': [
        { testName: 'Test 3', duration: '700ms', outcome: 'Passed' },
      ],
    },
  };

  return NextResponse.json(mockData);
}
