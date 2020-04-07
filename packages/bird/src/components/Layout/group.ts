export interface FieldPlacement {
  block_row: number; // 块行
  block: number; // 一个块行有多个块
  row: number; // 一个块有多行
  col: number; // 一行可以分为多列
}
export default function groupFields(fields: FieldPlacement[], group?: boolean) {
  // 字段分组，按几列显示
  let groupedFields: any[] = [];

  fields.map((field: FieldPlacement) => {
    const block_row = field.block_row * 1 || 0; //属于第几个块行
    const block = field.block * 1 || 0;
    const row = field.row * 1 || 0;
    const col = field.col * 1 || 0;

    if (!groupedFields[block_row]) {
      groupedFields[block_row] = [];
    }

    if (!groupedFields[block_row][block]) {
      groupedFields[block_row][block] = [];
    }

    if (!groupedFields[block_row][block][row]) {
      groupedFields[block_row][block][row] = [];
    }

    if (group) {
      if (!groupedFields[block_row][block][row][col]) {
        groupedFields[block_row][block][row][col] = [];
      }

      groupedFields[block_row][block][row][col].push(field);
    } else {
      if (!groupedFields[block_row][block][row][0]) {
        groupedFields[block_row][block][row][0] = [];
      }

      groupedFields[block_row][block][row][0].push(field);
    }
  });

  return groupedFields;
}
