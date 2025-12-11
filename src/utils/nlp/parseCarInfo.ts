export interface CarInfo {
  buying?: string;
  maint?: string;
  doors?: string;
  persons?: string;
  lug_boot?: string;
  safety?: string;
}

// Mapping từ tiếng Việt sang giá trị chuẩn
const buyingMap: { [key: string]: string } = {
  'thấp': 'low',
  'trung bình': 'med',
  'cao': 'high',
  'rất cao': 'vhigh',
  'rẻ': 'low',
  'đắt': 'high',
  'rất đắt': 'vhigh',
  'giá thấp': 'low',
  'giá cao': 'high',
  'giá rất cao': 'vhigh',
};

const maintMap: { [key: string]: string } = {
  'thấp': 'low',
  'trung bình': 'med',
  'cao': 'high',
  'rất cao': 'vhigh',
  'rẻ': 'low',
  'đắt': 'high',
  'chi phí bảo trì thấp': 'low',
  'chi phí bảo trì cao': 'high',
};

const doorsMap: { [key: string]: string } = {
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5more',
  '5 trở lên': '5more',
  'nhiều hơn 5': '5more',
  'hai': '2',
  'ba': '3',
  'bốn': '4',
  'năm': '5more',
};

const personsMap: { [key: string]: string } = {
  '2': '2',
  '4': '4',
  'nhiều hơn 4': 'more',
  'hơn 4': 'more',
  'hai': '2',
  'bốn': '4',
  'nhiều': 'more',
};

const lugBootMap: { [key: string]: string } = {
  'nhỏ': 'small',
  'trung bình': 'med',
  'lớn': 'big',
  'vừa': 'med',
  'to': 'big',
  'bé': 'small',
};

const safetyMap: { [key: string]: string } = {
  'thấp': 'low',
  'trung bình': 'med',
  'cao': 'high',
  'an toàn thấp': 'low',
  'an toàn cao': 'high',
};

function normalizeValue(value: string, map: { [key: string]: string }): string | undefined {
  const lowerValue = value.toLowerCase().trim();
  
  // Tìm exact match
  if (map[lowerValue]) {
    return map[lowerValue];
  }
  
  // Tìm partial match
  for (const [key, mappedValue] of Object.entries(map)) {
    if (lowerValue.includes(key) || key.includes(lowerValue)) {
      return mappedValue;
    }
  }
  
  return undefined;
}

function parseCarInfo(text: string): CarInfo {
  const lowerText = text.toLowerCase();
  const info: CarInfo = {};
  
  // Trích xuất buying (giá mua)
  const buyingPatterns = [
    /giá\s*(?:mua|xe|hơi|khá|rất)?\s*(?:là|:|)?\s*(thấp|trung bình|cao|rất cao|rẻ|đắt)/i,
    /(?:mua|giá)\s*(?:hơi|khá|rất)?\s*(thấp|trung bình|cao|rất cao|rẻ|đắt)/i,
    /(?:hơi|khá|rất)?\s*(thấp|trung bình|cao|rất cao|rẻ|đắt)\s*(?:giá|mua)/i,
    /(?:xe\s+)?(?:có\s+)?giá\s+(?:hơi|khá|rất)?\s*(thấp|trung bình|cao|rất cao|rẻ|đắt)/i,
  ];
  
  for (const pattern of buyingPatterns) {
    const match = lowerText.match(pattern);
    if (match) {
      const value = normalizeValue(match[1], buyingMap);
      if (value) {
        info.buying = value;
        break;
      }
    }
  }
  
  // Trích xuất maint (chi phí bảo trì)
  const maintPatterns = [
    /(?:chi phí|bảo trì|duy trì)\s*(?:là|:|)?\s*(?:hơi|khá|rất)?\s*(thấp|trung bình|cao|rất cao|rẻ|đắt)/i,
    /(?:maint|maintenance)\s*(?:là|:|)?\s*(?:hơi|khá|rất)?\s*(thấp|trung bình|cao|rất cao)/i,
    /(?:hơi|khá|rất)?\s*(thấp|trung bình|cao|rất cao|rẻ|đắt)\s*(?:bảo trì|duy trì)/i,
    /bảo trì\s+(?:hơi|khá|rất)?\s*(thấp|trung bình|cao|rất cao)/i,
  ];
  
  for (const pattern of maintPatterns) {
    const match = lowerText.match(pattern);
    if (match) {
      const value = normalizeValue(match[1], maintMap);
      if (value) {
        info.maint = value;
        break;
      }
    }
  }
  
  // Trích xuất doors (số cửa)
  const doorsPatterns = [
    /(?:cửa|door)\s*(?:là|:|)?\s*(\d+|hai|ba|bốn|năm)/i,
    /(\d+|hai|ba|bốn|năm)\s*(?:cửa|door)/i,
  ];
  
  for (const pattern of doorsPatterns) {
    const match = lowerText.match(pattern);
    if (match) {
      const value = normalizeValue(match[1], doorsMap);
      if (value) {
        info.doors = value;
        break;
      }
    }
  }
  
  // Trích xuất persons (số người)
  const personsPatterns = [
    /(?:người|person|chỗ ngồi)\s*(?:là|:|)?\s*(\d+|hai|bốn|nhiều)/i,
    /(\d+|hai|bốn|nhiều)\s*(?:người|person|chỗ)/i,
  ];
  
  for (const pattern of personsPatterns) {
    const match = lowerText.match(pattern);
    if (match) {
      let value = normalizeValue(match[1], personsMap);
      // Xử lý số người: nếu số >= 5 hoặc > 4 thì map thành "more"
      if (!value && /^\d+$/.test(match[1])) {
        const num = parseInt(match[1], 10);
        if (num >= 5 || num > 4) {
          value = 'more';
        } else if (num === 2) {
          value = '2';
        } else if (num === 4) {
          value = '4';
        }
      }
      if (value) {
        info.persons = value;
        break;
      }
    }
  }
  
  // Trích xuất lug_boot (khoang hành lý)
  const lugBootPatterns = [
    /(?:khoang|hành lý|cốp|lug|boot)\s*(?:là|:|)?\s*(?:hơi|khá|rất)?\s*(nhỏ|trung bình|lớn|vừa|to|bé)/i,
    /(?:hơi|khá|rất)?\s*(nhỏ|trung bình|lớn|vừa|to|bé)\s*(?:khoang|hành lý|cốp)/i,
  ];
  
  for (const pattern of lugBootPatterns) {
    const match = lowerText.match(pattern);
    if (match) {
      const value = normalizeValue(match[1], lugBootMap);
      if (value) {
        info.lug_boot = value;
        break;
      }
    }
  }
  
  // Trích xuất safety (an toàn)
  const safetyPatterns = [
    /(?:an toàn|safety)\s*(?:là|:|)?\s*(?:hơi|khá|rất)?\s*(thấp|trung bình|cao)/i,
    /(?:hơi|khá|rất)?\s*(thấp|trung bình|cao)\s*(?:an toàn|safety)/i,
    /an toàn\s+(?:hơi|khá|rất)?\s*(thấp|trung bình|cao)/i,
  ];
  
  for (const pattern of safetyPatterns) {
    const match = lowerText.match(pattern);
    if (match) {
      const value = normalizeValue(match[1], safetyMap);
      if (value) {
        info.safety = value;
        break;
      }
    }
  }
  
  return info;
}

// Hàm kiểm tra xem có đủ thông tin không
function hasCompleteInfo(info: CarInfo): boolean {
  return !!(
    info.buying &&
    info.maint &&
    info.doors &&
    info.persons &&
    info.lug_boot &&
    info.safety
  );
}

// Hàm tạo câu hỏi cho thông tin còn thiếu
function generateMissingQuestions(info: CarInfo): string[] {
  const questions: string[] = [];
  
  if (!info.buying) {
    questions.push('Giá mua của xe là bao nhiêu? (thấp/trung bình/cao/rất cao)');
  }
  if (!info.maint) {
    questions.push('Chi phí bảo trì như thế nào? (thấp/trung bình/cao/rất cao)');
  }
  if (!info.doors) {
    questions.push('Xe có bao nhiêu cửa? (2/3/4/5 trở lên)');
  }
  if (!info.persons) {
    questions.push('Xe chở được bao nhiêu người? (2/4/nhiều hơn 4)');
  }
  if (!info.lug_boot) {
    questions.push('Khoang hành lý như thế nào? (nhỏ/trung bình/lớn)');
  }
  if (!info.safety) {
    questions.push('Mức độ an toàn của xe? (thấp/trung bình/cao)');
  }
  
  return questions;
}

export { parseCarInfo, hasCompleteInfo, generateMissingQuestions };

