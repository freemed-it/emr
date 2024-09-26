import { format } from 'date-fns';
import { KmCharts } from 'src/km/entity/charts.entity';
import { MCharts } from 'src/m/entity/charts.entity';
import { Department } from 'src/orders/const/department.const';
import { Repository } from 'typeorm';

export const generateChartNumber = async (
  department: Department,
  repository: Repository<MCharts | KmCharts>,
) => {
  const todayDate = format(new Date(), 'yyMMdd'); // 오늘 날짜 YYMMDD 형식으로
  const departmentCode = department === Department.M ? '1' : '2'; // 진료과 코드 설정
  const baseNum = `${todayDate}${departmentCode}`; // 기본 차트 번호
  let newNum = '001'; // 기본 값 001

  // 오늘 생성된 차트 중 가장 최신의 차트 번호 가져오기
  const lastChart = await repository
    .createQueryBuilder('chart')
    .where('chart.chartNumber LIKE :chartNumber', {
      chartNumber: `${todayDate}${departmentCode}%`,
    })
    .orderBy('chart.chartNumber', 'DESC')
    .getOne();

  if (lastChart?.chartNumber) {
    // 가장 최신의 차트 번호 마지막 두 자리를 가져와 +1
    const lastNum = parseInt(lastChart.chartNumber.slice(-3));
    newNum = (lastNum + 1).toString().padStart(3, '0');
  }

  return `${baseNum}${newNum}`;
};
