import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const app = searchParams.get('app') || 'DefaultApp';

  const mockData = {
    totalTests: 42,
    lastPipelineOutcomes: {
      'Pipeline A': 'Passed',
      'Pipeline B': 'Failed',
    },
    codeCoverage: [
      { module: 'Authentication', coverage: 85 },
      { module: 'Payment', coverage: 78 },
      { module: 'User Profile', coverage: 92 },
    ],
    testGroups: {
      'Unit Tests': [
        { testName: 'Successful Login', duration: '200ms', outcome: 'Passed' },
        { testName: 'Failed Login', duration: '150ms', outcome: 'Failed' },
      ],
      'Integration Tests': [
        { testName: 'Process Payment', duration: '350ms', outcome: 'Passed' },
      ],
    },
  };

  return NextResponse.json(mockData);
}

// import { NextResponse } from 'next/server';
// import { getApplicationTestScope } from '../get-application-test-scope/get-application-test-scope';

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const app = searchParams.get('app');

//   const applicationTestScope = await getApplicationTestScope(app);

//   if (!app || !applicationTestScope[app]) {
//     return NextResponse.json(
//       { error: 'Application not found or not specified' },
//       { status: 404 },
//     );
//   }

//   const appData = applicationTestScope[app];

//   const responseData = {
//     totalTests: appData.testResults?.totalTests ?? 0,
//     codeCoverage:
//       appData.codeCoverage?.flatMap(
//         (coverage) =>
//           coverage.modules?.map((module) => ({
//             module: module.name || 'Unknown Module',
//             coverage: module.statistics?.linesCovered ?? 0,
//           })) ?? [],
//       ) ?? [],
//     testGroups: appData.testResults?.testGroups ?? {},
//   };

//   return NextResponse.json(responseData);
// }
