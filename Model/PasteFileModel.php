<?php

namespace Kanboard\Plugin\PITM\Model;

use Kanboard\Model\FileModel;
use Kanboard\Core\ObjectStorage\ObjectStorageException;

class PasteFileModel extends FileModel
{
    protected function getTable()
    {
    }

    protected function getForeignKey()
    {
    }

    protected function getPathPrefix()
    {
        return 'tasks/pitm/temp';
    }

    protected function fireCreationEvent($file_id)
    {
    }

    protected function fireDestructionEvent($file_id)
    {
    }

    public function storeTempContent($tempPath, $data)
    {
        try
        {
            if (empty($data))
            {
                $this->logger->error(__METHOD__ . ': Content upload with no data');
                return false;
            }

            $destinationFilename = $this->getPathPrefix() . DIRECTORY_SEPARATOR . $tempPath . DIRECTORY_SEPARATOR . md5($data);

            if ((!file_exists($destinationFilename)))
            {
                $this->logger->info($destinationFilename);
                $this->objectStorage->put($destinationFilename, $data);
            }

            return $destinationFilename;
        }
        catch (ObjectStorageException $e)
        {
            $this->logger->error($e->getMessage());
            return false;
        }
    }

    public function moveImagesToTask($taskId)
    {
        $imagenumber = 0;
        $task = $this->taskFinderModel->getById($taskId);

        $description = $task['description'];
        $needle = '<PITM:';
        $found = strpos($description, $needle);

        if ($found !== false) {
            $needleEnd = '>';
            while ($found !== false) {
                $start = $found + 6;
                $end = strpos($description, $needleEnd, $start);

                if ($end === false) {
                    return;
                }

                $tag = substr($description, $found, $end - $found + 1);

                $fileNameLenght = $end - $start;

                $fileName = substr($description, $start, $fileNameLenght);
                $link = '';

                try {
                    ++$imagenumber;
                    $data = $this->objectStorage->get($fileName);
                    $this->objectStorage->remove($fileName);
                    $filePath = $this->taskFileModel->uploadContent($taskId, $imagenumber . ".png", $data);

                    $link = '<img src="?controller=FileViewerController&action=image&task_id=' . $taskId . '&file_id=' . $filePath . '" class="enlargable" />';
                } catch (ObjectStorageException $e) {
                    $this->logger->error($e->getMessage());
                }

                $description = str_replace($tag, $link, $description);

                $found = strpos($description, '<PITM:');
            }

            $task['description'] = $description;
            $this->taskModificationModel->update($task);
        }
    }
}
