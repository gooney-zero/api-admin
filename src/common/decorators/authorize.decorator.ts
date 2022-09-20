import { SetMetadata } from '@nestjs/common';

export const AUTHORIZE_KEY_METADATA = 'authorize';
/**
 * 允许 接口 不校验 token
 */
export const Authorize = () => SetMetadata(AUTHORIZE_KEY_METADATA, true);
