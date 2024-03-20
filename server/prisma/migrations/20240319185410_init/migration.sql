-- CreateTable
CREATE TABLE `Snippet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `language_code` INTEGER NOT NULL,
    `language_name` VARCHAR(191) NOT NULL,
    `judge0_token` VARCHAR(191) NOT NULL,
    `stdin` VARCHAR(191) NOT NULL,
    `source_code` VARCHAR(500) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Snippet_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
